import { h, ref, computed, onMounted, watch, VNodeChild, Ref } from "vue";
import { useMessage, createDiscreteApi } from "naive-ui";
import { FeedBackReq, updateFeedback } from "../api/history";
import Tesseract from "tesseract.js";

const { message } = createDiscreteApi(["message"]);

export function countWord(str: string, lang: number): number {
  if (lang === 0) {
    const regex = /\S+/g;
    const matches = str.match(regex);
    return matches ? matches.length : 0;
  } else {
    return str.length;
  }
}

export function inputCountRender(
  props: { value: string },
  language: number,
  inputCountLimit: Ref
): VNodeChild {
  var len = 0;
  const str = props.value;
  len = countWord(str, language);
  const maxLen = 1000;
  const text = len.toString() + " / " + maxLen.toString();
  inputCountLimit.value = len > maxLen;
  if (len > maxLen) {
    return h(
      "div",
      {
        class: "text-orange-500 font-bold",
      },
      [text + " 超出字数限制"]
    );
  }
  return text;
}

export async function getPaste(originText: Ref) {
  const clipboardItems = await navigator.clipboard.read();

  let pasteText = "";
  if (clipboardItems.length === 0) {
    message.error("请先复制内容或者截图");
    return;
  }
  const clipboardItem = clipboardItems[0];
  if (/text/.test(clipboardItem.types[0])) {
    pasteText = await navigator.clipboard.readText();
    originText.value = originText.value + pasteText;
  } else {
    for (const type of clipboardItem.types) {
      const typeData = await clipboardItem.getType(type);
      if (/image/.test(type)) {
        // 将图片内容读取为 DataUrl
        const imgUrl = URL.createObjectURL(typeData);
        originText.value = "正在解析图片，请稍候...";
        Tesseract.recognize(imgUrl, "eng+chi_sim", {
          logger: (m) => console.log(m),
        }).then(({ data: { text } }) => {
          pasteText = text;
          originText.value = "";
          originText.value = originText.value + pasteText;
        });
      }
    }
  }
}

export function copyText(str: string) {
  navigator.clipboard.writeText(str);
  message.success("复制成功");
}
export function setFeedBack(
  isGoodFeed: Ref<number>,
  type: number,
  resId: number
) {
  isGoodFeed.value = type;
  doFeedback(type, resId);
}
export async function doFeedback(type: number, resId: number) {
  try {
    const req: FeedBackReq = {
      id: resId.toString(),
      feedback: type,
    };
    const res = await updateFeedback(req);
    message.success(res.message);
  } catch (err) {
    message.error("失败，请重试");
  } finally {
  }
}

export function tagWords(
  strOri: string,
  strCorrect: string,
  lang: number
): string {
  var s1Array;
  var s2Array;
  if (lang === 0) {
    s1Array = strOri.split(" ");
    s2Array = strCorrect.split(" ");
  } else {
    s1Array = Array.from(strOri);
    s2Array = Array.from(strCorrect);
  }

  const commonLength = new Array(s1Array.length);
  for (let i = 0; i < commonLength.length; i++) {
    commonLength[i] = new Array(s2Array.length).fill(0);
  }

  for (let i = 0; i < s2Array.length; i++) {
    commonLength[0][i] = 0;
  }

  for (let i = 0; i < s1Array.length; i++) {
    commonLength[i][0] = 0;
  }

  for (let i = 0; i < s1Array.length; i++) {
    for (let j = 0; j < s2Array.length; j++) {
      if (i === 0 || j === 0) {
        if (s1Array[i] === s2Array[j]) commonLength[i][j] = 1;
        else
          commonLength[i][j] =
            i > 0 ? commonLength[i - 1][j] : j > 0 ? commonLength[i][j - 1] : 0;
      } else {
        if (s1Array[i] === s2Array[j]) {
          commonLength[i][j] = commonLength[i - 1][j - 1] + 1;
        } else {
          commonLength[i][j] = Math.max(
            commonLength[i][j - 1],
            commonLength[i - 1][j]
          );
        }
      }
    }
  }

  let i = s1Array.length - 1;
  let j = s2Array.length - 1;
  let cur = 0;
  var result = [];
  let sentenceId = 0;
  const regex = /\.$/;

  while (i >= 0 && j >= 0) {
    var str = {
      strid: 0,
      type: "",
      origin: "",
      correction: "",
      id: 0,
    };
    if (regex.test(s2Array[j])) {
      sentenceId = sentenceId + 1;
    }
    str.strid = sentenceId;

    if (i >= 0 && j >= 0 && s1Array[i] === s2Array[j]) {
      str["origin"] = s1Array[i];
      str["type"] = "right";
      i--;
      j--;
    } else if (
      (i > 0 &&
        j > 0 &&
        s1Array[i] !== s2Array[j] &&
        commonLength[i - 1][j] === commonLength[i][j] &&
        commonLength[i][j - 1] === commonLength[i][j]) ||
      (i === 0 && j === 0 && s1Array[i] !== s2Array[j])
    ) {
      str["correction"] = s2Array[j];
      str["type"] = "change";
      str["origin"] = s1Array[i];
      i--;
      j--;
    } else if (
      i > 0 &&
      s1Array[i] !== s2Array[j] &&
      commonLength[i - 1][j] === commonLength[i][j]
    ) {
      str["type"] = "remove";
      str["origin"] = s1Array[i];
      i--;
    } else if (
      j > 0 &&
      s1Array[i] !== s2Array[j] &&
      commonLength[i][j - 1] === commonLength[i][j]
    ) {
      str["type"] = "add";
      str["correction"] = s2Array[j];
      j--;
    } else {
      i--;
      j--;
    }
    str.id = cur++;
    result.push(str);
  }

  var resultStr = "";
  resultStr = resultStr + "</span>";

  var strTag = 1;
  var strAddCnt = 0;

  for (var sstr of result) {
    if (strTag !== sstr.strid) {
      resultStr = '</span><span id="sentence-' + strTag + '">' + resultStr;
      strTag = sstr.strid;
      strAddCnt = 0;
    }

    var show;
    if (sstr.type === "add") {
      show =
        '<span id="span-res-' +
        sstr.id +
        '" style="color: green; ">' +
        sstr.correction +
        "</span>";
      strAddCnt++;
    } else if (sstr.type === "change") {
      show =
        '<span id="span-res-' +
        sstr.id +
        '" style="color: blue; ">' +
        sstr.correction +
        "</span>";
    } else if (sstr.type === "right") {
      show = '<span id="span-res-' + sstr.id + '">' + sstr.origin + "</span>";
    } else {
      continue;
    }
    if (lang === 0) {
      resultStr = show + " " + resultStr;
    } else {
      resultStr = show + resultStr;
    }
  }
  if (strAddCnt > 3) {
    resultStr =
      '<span id="sentence-' +
      strTag +
      '" style = "border-bottom: 2px solid #b91c1c;">' +
      resultStr;
  } else {
    resultStr = '<span id="sentence-' + strTag + '" >' + resultStr;
  }

  return resultStr;
}
