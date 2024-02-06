import type { UploadInst, UploadFileInfo } from "naive-ui"
import { useMessage,createDiscreteApi} from 'naive-ui';
import { parseFile, FileProcessReq, FileProcessResp } from '../api/file'
import { getToken } from "./auth";
import { httpClient } from "../api/http";
import router from "../router/index";
import { h, ref, computed, onMounted, watch, VNodeChild, Ref} from "vue";
import Tesseract  from 'tesseract.js';


const { message } = createDiscreteApi(['message']);
export async function beforeUpload(data:{file: UploadFileInfo,fileList: UploadFileInfo[]}){
    const access_file_type = ["pdf","doc","docx","jpeg","jpg","png","image","document"]
    for (let file_type of access_file_type) {
        if(data.file.file?.type.includes(file_type)){
            if(data.file.file.size > 1024*1024*5){
                message.error("文件大小不能超过5M")
                return false
            }else{
                return true
            }
        }
    }
    message.error("请上传pdf文件或者word文件以及图片文件")
    return false
}

export async function processFile( file:UploadFileInfo ,originText: Ref){
    var file_type
    var pasteText = ""
    if (file.file?.type.includes("pdf")){
        originText.value = '正在解析文件，请稍候...'
        file_type = 'pdf'
    }else if(file.file?.type.includes("image")){
        originText.value = '正在解析图片，请稍候...'
        
        Tesseract.recognize(file.file as File, 'eng+chi_sim', { logger: m => console.log(m) }).
        then(({ data: { text } }) => {
          pasteText = text
          originText.value = ''
          originText.value = originText.value + pasteText
          message.success("图片解析成功")
        })
        return
    }else{ 
        file_type = 'doc'
    }
    const formData = new FormData()
    try{
            formData.append('file', file.file as File)
            formData.append('file_type', file_type)
            formData.append('access_token', getToken())
            const parseReq:FileProcessReq = {
                "formdata": formData
            }
            const parseRes:FileProcessResp = await parseFile(parseReq)
            if (parseRes.text){
                message.success("文件解析成功")
                originText.value = parseRes.text
            }
        }catch(err){
            message.error("文件解析失败")
    }
}