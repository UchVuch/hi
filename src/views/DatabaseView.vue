<template>
  <div style="padding-left: 20px; padding-top: 100px;" v-if="access.files > 0">
    <div class="pt-5 pb-10 pr-5">

      <!-- Добавить папку или файл-->
      <div class="pt-8 pb-10" v-if="access.files > 1">
          <div class="d-flex justify-end align-center w-100">
              <v-btn class="mr-4" color="add-new"
                  @click="startCreateDir"
              >
                  <v-icon icon="mdi-plus"></v-icon>
                  <v-icon icon="mdi-folder"></v-icon>
              </v-btn>
      
              <div>
                  <div class="input-group">
                      <v-btn 
                      color="add-new"
                      v-on:click="chooseFiles"
                      >
                      <v-icon icon="mdi-plus"></v-icon>
                      <v-icon icon="mdi-file"></v-icon>
                      </v-btn>
                      <input style="display:none" v-on:change="filesPicked" id="fileinput" type="file" multiple />
                  <!--label style="background-color:lightblue" for="file">Нажмите для выбора файла</label-->
                      
                  </div>
              </div>
          </div>
          
          <v-dialog
              v-model="isFileLoading"
              hide-overlay
              persistent
              width="300"
          >
              <v-card
              color="primary"
              dark
              >
              <v-card-text>
                  Загрузка
                  <v-progress-linear
                  indeterminate
                  color="white"
                  class="mb-0"
                  ></v-progress-linear>
              </v-card-text>
              </v-card>
          </v-dialog>
      
          <div class="mt-6">
              <div v-if="isCreatingFolder || isUploading" @click="closeCreatingFields" style="cursor: pointer; display: flex; justify-content: flex-end; margin-bottom: 10px;">
                <v-icon icon="mdi-arrow-up-drop-circle-outline">
                </v-icon>Скрыть</div>
              <div class="d-flex flex-column align-end" v-if="isUploading">
                  <div id="fileinputlabel">
                      {{getUploadingFilesLabel()}}
                  </div>
                  <v-row class="mt-2">
                      <v-btn
                          color="primary" 
                          :disabled="uploadingFiles.length===0"
                          v-on:click="sendFiles"
                      >
                          Добавить
                      </v-btn>
                  </v-row>
              </div>

              <div class="d-flex flex-column align-end" v-if="isCreatingFolder">
                  <div class="mb-2 w-100">
                      <v-text-field 
                          label="Название папки"
                          hide-details
                          v-model="nameNewDir"
                          v-on:keyup.enter="createDir"
                      ></v-text-field>
                  </div>
                  <div>
                      <v-btn
                          color="primary"
                          @click="createDir"
                      >
                          Создать папку
                      </v-btn>
                  </div>
              </div>
          </div>
      </div>

      <!-- Вывод пути к текущей директории -->
      <div class="row flex-wrap pb-5 ml-0 mr-0 container-fluid" v-if="way_frontend.length > 1">
            <div 
              class="flex-nowrap align-center ml-0 col-2 pl-0 mr-4"
              v-if="way_frontend.length > 1"
            >
                <v-btn class="pl-3 pr-3"
                color="primary" 
                v-on:click="setWayFolder(-1,'')"
                text
                >
                  <v-icon>
                    mdi-arrow-left-box
                  </v-icon>

                  Назад
                </v-btn>
            </div>
            <div style="height: 36px" v-else></div>
            <div class="col-2">
            </div>
      </div>
      <div class="d-flex flex-wrap mr-0 ml-0 mb-0 mt-0 align-center justify-content-start">
              <div class="d-flex flex-wrap mr-0 ml-0 mb-2 mt-0 align-center justify-content-start"
                v-for="folder of way_frontend">
                {{folder.name}}
                <v-icon color="gray">
                  mdi-chevron-right
                </v-icon>
              </div>
      </div>

      <!-- Вывод содержимого текущей директории-->
      <div class="pb-1 pt-1 text-center mt-4 mb-2"
          v-if="files.length === 0 && folders.length === 0">
        Пусто
      </div>
      <div class="mt-4 mb-2" v-else>
        <v-row class="folder-line d-flex align-center mb-6"  
        v-for="folder of folders"> 
          <!-- <div style="width: 32px;" v-if="!isAdmin"></div>  -->
          <div style="width: 32px;"></div> 
          <!-- <v-icon class="mr-2"
          color="primary"
          @click="openDirDialog(folder.id, folder.name)"
          v-if="isAdmin">
            mdi-pencil
          </v-icon> -->
          <v-btn class="pl-2 pr-2 flex-grow-1 justify-start"
          v-on:click="setWayFolder(folder.id,folder.name)">
            <v-icon
              color="primary"
              size="24"
              class="pa-0 mr-3">      
              mdi-folder
            </v-icon>
            <span class="red--tex file-name pa-0">
              {{folder.name}}
            </span>
          </v-btn>
          <v-icon class="ml-3" 
          color="red darken-4"
          @click="deleteDir(folder.id)"
          v-if="access.files > 2">
            mdi-delete
          </v-icon>
        </v-row>
      
        <v-row  class="file-line d-flex align-center mb-6" 
          v-for="file of files">
                <v-icon class="mr-2"
                color="primary"
                @click="openFileDialog(file)"
                v-if="access.files > 1">
                  mdi-pencil
                </v-icon>
                <div style="width: 32px;" v-else></div> 
                <v-btn class="pl-2 pr-2 flex-grow-1 justify-start"
                :download="file.name" 
                :href="`/api/files/${file.id}`">
                  <v-icon 
                    color="green" 
                    size="24"
                    class="pa-0 mr-3"
                    >
                    mdi-arrow-down-box
                  </v-icon>
                  <span class="file-name pa-0">
                    {{file.name}}
                  </span>
                </v-btn>
                <v-icon 
                color="primary" 
                title="Смотреть описание файла"
                @click="openCaptionDialog(file)">
                  mdi-information
                </v-icon>
                <v-icon class="ml-3"
                color="red darken-4"
                @click="deleteFile(file.id)"
                v-if="access.files > 2">
                  mdi-delete
                </v-icon>
        </v-row>

        <v-dialog class="file-dialog"
          v-model="fileDialog"
          max-width="1200px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Изменить название файла</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                    <v-text-field
                      label="Название"
                      required
                      v-model="newFileName"
                      v-on:keyup.enter="sendFileName"
                    ></v-text-field>
                </v-row>
                <v-row>
                    <v-textarea 
                      label="Описание"
                      required
                      clear-icon="mdi-logout"
                      v-model="newFileCaption"
                      v-on:keyup.enter="sendFileName"
                    ></v-textarea>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeFileDialog"
            >
              Закрыть
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="sendFileName"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>


        <v-dialog class="dir-dialog"
          v-model="dirDialog"
          max-width="800px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Изменить название папки</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                    <v-text-field 
                      label="Название"
                      required
                      v-model="updateDirName"
                      v-on:keyup.enter="sendDirName"
                    ></v-text-field>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeDirDialog"
            >
              Закрыть
            </v-btn>
            <v-btn
              color="green darken-1"
              text
              @click="sendDirName"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog class="caption-dialog"
          v-model="captionDialog"
          max-width="1200px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">Описание файла {{nameCaption}}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                    <p class="font-weight-regular">
                      {{infoCaption}}
                    </p>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="closeCaptionDialog"
            >
              Закрыть
            </v-btn>
          </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

    </div>
    <div id="dialogbox" class="slit-in-vertical">
        <div>
            <div id="dialogboxbody"></div>
        </div>
    </div>
  </div>
</template>

<script>
import { logout } from '../api'

import { mapState } from 'pinia'
import {useAuthStore} from '@/plugins/store/auth'

export default {
    data: () => ({
      uploadingFiles:[],
      folders: [],
      files: [],
      way:"dir_0",
      way_frontend:[{name: '/', id: 0}],

      currentDirId: 0,
      nameNewDir: '',

      dirDialog: false,
      updateDirName: '',

      fileDialog: false,
      currentFileId: null,
      newFileName: '',
      newFileCaption: '',

      captionDialog: false,
      nameCaption: '',
      infoCaption: '',
      
      access: {
          files: 3
      },
      isAdmin: true,
      isUploading: false,
      isFileLoading: false,
      isCreatingFolder: false,
      errorDescription: '',
    }),

    async mounted() {
      // await this.getDir(this.currentDirId)
    },

  //   computed: {
  //     ...mapState(useAuthStore, {
  //       access: 'access'
  //     }),
  //   },
    
    methods: {
      closeCreatingFields() {
        this.isUploading = false
        this.isCreatingFolder = false
      },
      // путь до текущей директории/папки
      async setWayFolder(folderId,folderName) {
        if(folderId<0){
          this.way_frontend.pop()
          const prevDirId = this.way_frontend[this.way_frontend.length-1].id
          this.way = this.way.slice(0, 4) + prevDirId
          this.getDir(prevDirId)
          return
        }else{
          if(this.way_frontend.length > 0){
            this.way = this.way.slice(0, 4) + folderId
          }
          this.way_frontend.push({name: folderName, id: folderId})
        }
        await this.getDir(folderId)
      },
    // работа с файлом: имя, описание файла
      openCaptionDialog(file) {
        this.captionDialog = true
        this.nameCaption = file.name
        this.infoCaption = file.caption
      },
      closeCaptionDialog() {
        this.captionDialog = false
        this.nameCaption = ''
        this.infoCaption = ''
      },

      openFileDialog(file) {
        this.newFileName = file.name
        this.newFileCaption = file.caption
        this.currentFileId = file.id
        this.fileDialog = true
      },
      closeFileDialog() {
        this.fileDialog = false
        this.newFileName = ''
        this.newFileCaption = ''
      },
      async deleteFile(id) {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/files/${id}`, {
          method: 'DELETE'
        })

        if (response.status === 200) {
          this.currentDirId = Number(this.way.slice(4))
          this.getDir(this.currentDirId)
          // или
          //this.files.splice(this.files.indexOf(id), 1)
          this.customAlert('Файл удалён')
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          await logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        } 
      },
      async sendFileName() {
        const id = this.currentFileId
        const updatedFile = {
          name: this.newFileName,
          caption: this.newFileCaption
        }

        console.log(updatedFile)

        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/files/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(updatedFile)
        })
        if(response.status === 200) {
          // const data = await response.json() 

          this.currentDirId = Number(this.way.slice(4))     
          this.getDir(this.currentDirId)

          this.closeFileDialog()
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          await logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      // работа с директориями/папками
      openDirDialog(dirId, dirName) {
        this.updateDirName = dirName
        this.dirDialog = true
        this.updateDirId = dirId
      },
      closeDirDialog() {
        this.updateDirName = ''
        this.dirDialog = false
      },
      async getDir(id) {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/dirs/${id}`)
        
        
        if (response.status === 200) {  
          const data = await response.json()
          this.folders = data.dirs
          this.files = data.files
          // this.folders.push({id: 1, name: 'тестовая папка'})
          // this.files.push({id: 1, name: 'файл 1', caption: 'Описание'})
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          await logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          // this.errorDescription = 'Ошибка в базе данных'
          this.customAlert(this.errorDescription)
        }
      },
      startCreateDir() {
          this.isUploading = false
          this.isCreatingFolder = true
      },
      async createDir() {
        this.currentDirId = Number(this.way.slice(4))

        const newDir = {
          dir_id: this.currentDirId,
          name: this.nameNewDir
        }

        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/dirs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(newDir)
        })

        
          if(response.status === 200) {
          // const data = await response.json()      
          // this.folders.push({name: `${this.nameNewDir}`, id: data.id})
          this.isCreatingFolder = false
          this.getDir(this.currentDirId)
          this.nameNewDir = ''
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          await logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      async deleteDir(id) {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/dirs/${id}`, {
          method: 'DELETE'
        })

        if (response.status === 200) {
          this.currentDirId = Number(this.way.slice(4))
          this.getDir(this.currentDirId)
          // или
          // this.dirs.splice(this.dirs.indexOf(id), 1)
          this.customAlert('Папка удалена')
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          await logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        } 
      },
      async sendDirName() {
        const id = this.updateDirId
        const updatedDir = {
          name: this.updateDirName,
        }

        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/dirs/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(updatedDir)
        })
          // const response = {status: 200}
          if(response.status === 200) {  
          this.currentDirId = Number(this.way.slice(4)) 
          this.getDir(this.currentDirId)
          this.closeDirDialog()
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          await logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      //загрузка новых файлов
      chooseFiles() {
          this.isCreatingFolder = false
          this.isUploading = true
        document.getElementById("fileinput").click()
      },
      filesPicked() {
        this.isFileLoading = true
        console.log('picked files')
        let inputFile=document.getElementById('fileinput');
        this.uploadingFiles=inputFile.files
        setTimeout(()=>this.isFileLoading = false, 0)       
      },
      getUploadingFilesLabel() {
        if(this.uploadingFiles.length===0){
          return 'Файлы не выбраны'
        }
        let s=''
        for (const file of this.uploadingFiles) {
          if(s!==''){
            s+=','
          }
              s+=file.name
        }
        return s
      },
      async sendFiles() {
        this.isFileLoading = true
        const formData = new FormData();
        this.currentDirId = Number(this.way.slice(4))

        for (const file of this.uploadingFiles) {
            formData.append("files", file);
        }
        // JSON.stringify({way:this.way}) т.к. апи поменялось изменил это
        // на JSON.stringify({dir_id: this.currentDirId})
        
        for (var pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]); 
        }

        const labelWithName = document.getElementById('fileinputlabel')

        formData.append("config",JSON.stringify(
          {
            dir_id: this.currentDirId,
            name: `${labelWithName.textContent}`,
            caption: ''
          }
        ))

        let response=await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/files`, {
            method: "post",
            body: formData,
        }).catch((error) => ("Something went wrong!", error));
        
        if(response.status === 200) {    
        this.isFileLoading = false
        this.getDir(this.currentDirId)
        } 
        if (response.status === 401) {
          this.isFileLoading = false
          this.username = ''
          this.password = ''
          await logout()   
        } 
        
        if (response.status === 500) {
          this.isFileLoading = false
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
        if (response.status === 404) {
          this.isFileLoading = false
          alert("Сервер не отвечает")
        } else if (response.status>=400) {
          this.isFileLoading = false
          alert("Этот формат файла не поддерживается в данной папке!")
        }

        document.getElementById('fileinput').setAttribute("value",null)
        document.getElementById('fileinputlabel').nodeValue="Не выбрано"
        this.uploadingFiles=[]
        this.isUploading = false
      },

      customAlert(message) {
        const dialogbox = document.getElementById('dialogbox')

        dialogbox.style.top = "50px"
        dialogbox.style.right = "15px"

        dialogbox.style.display = "block"

        document.getElementById('dialogboxbody').textContent = message

        setTimeout(() => {
            dialogbox.style.animationName = 'slit-in-fade'
        }, 1400)
        setTimeout(() => {
            dialogbox.style.animationName = 'slit-in-vertical'
            dialogbox.style.display = "none"
        }, 1600)
      },
    }
}
</script>

<style scoped>
 .position-fixed {
    position: fixed;
  }

  .mnx-2 {
    margin-left: -8px;
    margin-right: -8px;
  }

  .role-col {
    flex-grow: 1.4 !important;
  }

  .file-dialog textarea.v-field__input{
    width: 700px;
    padding-left: 23px !important;
  }

  .file-line > .v-btn,
  .folder-line > .v-btn {
    width: auto;
    min-width: 24px;
    box-shadow: none;
    background-color: transparent;
  }

  .folder-line span.file-name {
    color: #2a92ca !important;
  }

  a:hover {
    color: inherit;
  }



  .change-user-dialog {
    width: 800px;
  }

  .change-user-dialog .v-select__selection-text,
  .create-user .v-select__selection-text {
    padding-left: 8px;
  }

  .checkbox-row .v-selection-control .v-label {
    height: 160%;
    white-space: normal;
  }

  .v-text-field > .v-input__control > .v-input__slot > .v-text-field__slot {
    background-color: #333;
  }

  .app {
    background-color: #444 !important;
  }

  .v-input input {
    padding-left: 8px !important;
  }

  .v-input .v-label {
    padding-left: 8px;
  }

  .v-textarea textarea {
    min-height: 92px !important;
    padding-left: 8px !important;
  }

  .overflow {
    background-color: white;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    max-width: 100%;
    z-index: 2;
  }

  .alert {
    margin: 0 auto !important;
    width: 100%;
    max-width: 100%;
  }

  #dialogbox{
  display: none;
  position: absolute;
  z-index: 10;
  top:0;
  right: 0;
  background: rgb(37, 37, 37);
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.575);
  transition: 0.3s;
  min-width: 250px;
  max-width: 450px;
  border-left: 4px solid rgb(114, 79, 79);
  /* border-left: 4px solid rgb(var(--v-theme-error)); */
  padding: 16px;
  word-wrap: break-word;
  }

  #dialogbox:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.911);
  }

  .slit-in-vertical {
    -webkit-animation: slit-in-vertical 0.45s ease-out both;
    animation: slit-in-vertical 0.45s ease-out both;
  }

  @keyframes slit-in-vertical {
    0% {
      -webkit-transform: translateX(800px);
      transform: translateX(800px);
      opacity: 0;
    }
    54% {
      -webkit-transform: translateX(160px);
      transform: translateX(160px);
      opacity: 1;
    }
    100% {
      -webkit-transform: translateX(0);
      transform: translateX(0);
    }
  }
  @keyframes slit-in-fade {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
</style>