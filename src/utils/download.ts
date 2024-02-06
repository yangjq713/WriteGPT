import { useMessage, createDiscreteApi } from "naive-ui";
import { getBinaryContent } from "jszip-utils";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";
const { message } = createDiscreteApi(["message"]);

export function downloadMd(originText: string, resText: string) {
  const markdownContent =
    "原文：" + originText + "</br>" + "文修输出：" + resText;
  const blob = new Blob([markdownContent], {
    type: "text/markdown;charset=utf-8",
  });
  saveAs(blob, "exported-document.md");
}

export function downloadDocs(originText: string, resText: string) {
  // 读取并获得模板文件的二进制内容
  // const jsZip = new JSZipUtils()
  getBinaryContent("../../assets/module.docx", (error: any, content: any) => {
    // model.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
    // 抛出异常
    if (error) {
      throw error;
    }
    // 创建一个PizZip实例，内容为模板的内容
    let zip = new PizZip(content);
    // 创建并加载docxtemplater实例对象
    let doc = new Docxtemplater().loadZip(zip);
    // 设置模板变量的值
    doc.setData({
      before_refine: originText,
      after_refine: resText,
    });
    try {
      // 用模板变量的值替换所有模板变量
      doc.render();
    } catch (err) {
      throw err;
    }
    // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
    let out = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    // 将目标文件对象保存为目标类型的文件，并命名
    saveAs(out, "export.docx");
  });
}
