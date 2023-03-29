<template>
  <div class="common-layout" id="app">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="12"><img src="/img/logo.png" style="height: 32px;" class="mt-12 pl-12"/></el-col>
          <el-col :span="12" class="text-right"><a href="https://github.com/sinamber/toolbox" target="_blank"><img src="/img/github.svg" style="height: 32px;" class="mt-12 pl-12"/></a></el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-card class="box-card">
          <div style="padding: 0;background: #141414;">
            <div class="ace-container">
              <div class="ace-editor" id="ace"></div>
            </div>
          </div>
          <div class="pl-12 text-error">{{errMsg}}</div>
          <div class="mt-12 text-right pr-12">
            <el-button @click="fmtJSON" type="success" size="large">FormatJSON</el-button>
            <el-button @click="compressJSON" type="success" size="large">CompressJSON</el-button>
            <el-button @click="copyContent" type="success" size="large">Copy</el-button>
            <el-button @click="clearContent" type="danger" size="large">Clear</el-button>
          </div>
        </el-card>
      </el-main>
      <el-footer class="text-white">
        <img src="/img/footer.png" alt="logo" style="height:48px;"/>
        <span class="pl-12">0.1.0 </span> by SineChen 2023
          <!--
             <a class="pl-12"  href="http://www.wtfpl.net/" target="_blank"><img src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-4.png" width="80" height="15" alt="WTFPL" /></a>
           -->
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { invoke } from "@tauri-apps/api/tauri";
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-twilight';

import {ElMessage} from "element-plus";

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'


document.addEventListener('DOMContentLoaded', () => {
    invoke('close_splashscreen')
})

export default {
  name: "App",
  created() {
  },
  mounted () {
      this.aceEditor = ace.edit('ace',this.aceOption)
      this.aceEditor.on("paste",this.onAceEditorPaste);
  },
  data () {
    return {
      aceEditor: null,
      aceOption: {
        theme: 'ace/theme/twilight',
        mode:'ace/mode/json',
        fontSize: 14,
        tabSize: 2,
        showPrintMargin: false,
        highlightActiveLine: true,
      },
      errMsg: '',
      content: '',
    }
  },
  methods : {
      initAceEditor(){
      },
      onAceEditorPaste(e) {
        NProgress.start();
        setTimeout(()=>{
          this.content = e.text;
          this.fmtJSON();
          NProgress.done(true);
        },200)
      },
      compressJSON(){
        try {
          this.errMsg = '';
          this.content = JSON.stringify(JSON.parse(this.content))
          this.aceEditor.setValue(this.content);
        } catch (e) {
          this.showErrorMsg(e)
        }
      },
      fmtJSON() {
        try {
          if(this.content === ''){
            return;
          }
          this.errMsg = '';
          let obj = eval('(' + this.content + ')');
          if(this.isJson(obj)){
            this.content = JSON.stringify(obj, null, 2)
          }else{
            this.content = JSON.stringify(JSON.parse(obj), null, 2)
          }
          this.aceEditor.setValue(this.content);
        } catch (e) {
          this.showErrorMsg(e)
        }
      },
      showErrorMsg(e){
        this.errMsg = `${e.message}`;
        console.log(`JSON FORMAT ERROR：${e.message}`);
      },
      copyContent(){
        navigator.clipboard.writeText(this.content);
        ElMessage({
          message: 'content has been copied to clipboard',
          type: 'success',
        })
      },
      clearContent(){
        this.errMsg = '';
        this.content = '';
        this.aceEditor.setValue('');
      },
      isJson(obj){
         return typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
      },
  }
}
</script>

<style>
body{
  margin: 0;
  padding: 0;
  background-color: #202020;
}

.ace-editor {
  width: 100%;
  height: 615px;
}

/* common styles */
.text-white {
  color: #ffffff;
}

.text-success{
  color: #198754;
}

.text-error{
  color:firebrick
}

.pl-12{
  padding-left:12px;
}
.pr-12{
  padding-right:12px;
}
.mt-12{
  margin-top:12px;
}
.text-right {
  text-align: right;
}
/* common styles */

/* override element-plus */
.el-main{
  margin: 0;
  padding: 0;
  --el-main-padding: 0;
}
.el-card {
  --el-card-padding: 0;
  --el-card-bg-color: #202020;
  border:1px solid #202020;
}

.el-card__header {
  border-bottom: 1px solid #202020;
  box-sizing: border-box;
}
/* override element-plus */
</style>
