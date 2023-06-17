<template>
  <v-app class="app">
    <v-container>
      <!--Вход -->
      <v-form
        class="py-5"
        v-if="form === Form.LOGIN"
      >
      
        <v-text-field
          label="Логин"
          v-model="username"
          v-on:keyup.enter="login"
        ></v-text-field>
        <v-text-field
          label="Пароль"
          type="password"
          autocomplete="on"
          v-model="password"
          v-on:keyup.enter="login"
        ></v-text-field>

        <v-btn
          block
          color="primary"
          v-on:click="login"
        >
          Войти
        </v-btn>
        
      </v-form>
      
      
      <div v-else>

        <!-- Сайдбар -->
        <v-app-bar-nav-icon class="mb-8" color="primary"
        @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-navigation-drawer
          v-model="drawer"
          absolute
          bottom
          temporary
        >

          <v-list class="mt-4">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-h6">
                  VSB Database 2.0
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-list
            nav
            dense
          >
            <v-list-item-group
              v-model="group"
              active-class="deep-purple--text text--accent-4"
            >
              <v-list-item v-on:click="toMain" class="mb-4 mt-2">
                <v-list-item-title>Генератор</v-list-item-title>
              </v-list-item>

              <v-list-item v-on:click="toDB" class="mb-4">
                <v-list-item-title>База данных</v-list-item-title>
              </v-list-item>

              <v-list-item v-on:click="toUsers" class="mb-4" v-if="isAdmin">
                <v-list-item-title>Пользователи</v-list-item-title>
              </v-list-item>

              <v-list-item v-on:click="logout" class="mb-4">
                <v-list-item-title>
                  <v-icon>mdi-logout</v-icon>
                  Выйти
                </v-list-item-title>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-navigation-drawer>
        <!--Контент  -->
        <div>
          <!--Основная страница -->
          <v-form
            class="pt-5 pb-10"
            v-if="form===Form.MAIN"
          >
            <div class="overflow position-fixed"
              v-if="isAlertVisible"
            >
              <v-alert class="alert"
                densemdi-logout
                text
                v-bind:type="isFetchSuccess ? 'success' : 'error'"
              >
                {{ isUnautorized ? 'Неверный пароль!' : isFetchSuccess ? 'Ключ успешно сгенерирован и скопирован в буфер обмена!' : 'Ошибка генерации ключа!' }}
              </v-alert>
            </div>

    



            <!-- Контент -->
            <div>
              <!-- <v-row>
                <v-col>
                  <v-btn
                    block
                    color="primary"
                    class="my-5 col-4"
                    v-on:click="logout"
                  >
                  <v-icon left >mdi-logout</v-icon>
                    Выйти
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn
                    block
                    color="primary"
                    class="my-5 col-4"
                    v-on:click="toDB"
                  >
                    Перейти в базу данных ВСБ
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn
                    block
                    color="primary"
                    class="my-5 col-4"
                    v-on:click="toUsers"
                  >
                    Перейти к пользователям
                  </v-btn>
              </v-col>
              </v-row> -->
              

              <div class="text-h5 font-weight-bold mb-10"
                v-text="'Для генерации ключа введите запрос и нажмите кнопку &quot;Создать&quot;'"
              ></div>

              <v-row>
                <v-col>
                  <v-text-field
                    label="Заказчик"
                    type="text"
                    v-model="customer"
                    id="customerfield"
                  ></v-text-field>
                </v-col>

                <v-col>
                  <v-text-field
                    label="Доп. информация"
                    type="text"
                    v-model="additionalInfo"
                  ></v-text-field>
                </v-col>
              </v-row>

              <div
                v-for="(nonce, idx) of nonces"
                v-bind:key="idx"
              >
                <div class="d-flex mnx-2">
                  <div class="flex-grow-1 d-flex align-center px-2">
                    <v-text-field
                      label="Запрос"
                      id="noncefield"
                      type="text"
                      v-model="nonces[idx]"
                    ></v-text-field>
                  </div>

                  <div class="d-flex align-center px-2">
                    <v-btn
                      color="error"
                      v-bind:disabled="idx === 0"
                      v-on:click="removeNonce(idx)"
                    >
                      <v-icon>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>

              <div class="d-flex mnx-2 mb-3">
                <div class="flex-grow-1 d-flex align-center px-2"></div>

                <div class="d-flex align-center px-2">
                  <v-btn
                    color="success"
                    v-on:click="addNewNonce"
                  >
                    <v-icon>
                      mdi-plus-box-multiple
                    </v-icon>
                  </v-btn>
                </div>
              </div>

              <v-row class="pt-3 pb-7 mt-4 checkbox-row">
                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Раздел &quot;Пользователи&quot;"
                    required
                    v-model="checkboxes.n"
                  ></v-checkbox>
                </v-col>
                
                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Сервер приложений"
                    required
                    v-model="checkboxes.s"
                  ></v-checkbox>
                </v-col>
                
                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Раздел &quot;Аналитика&quot;"
                    required
                    v-model="checkboxes.o"
                  ></v-checkbox>
                </v-col>

                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Просмотр системных логов и краткой статистики"
                    required
                    v-model="checkboxes.v"
                  ></v-checkbox>
                </v-col>
              </v-row>

              <v-row class="pt-3 pb-7 mt-4 checkbox-row">
                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Раздел &quot;Настройка регистратора&quot;"
                    required
                    v-model="checkboxes.e"
                  ></v-checkbox>
                </v-col>
                
                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Общие настройки"
                    required
                    v-model="checkboxes.m"
                  ></v-checkbox>
                </v-col>
                
                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Управление СВ"
                    required
                    v-model="checkboxes.a"
                  ></v-checkbox>
                </v-col>
                
                <v-col class="pb-0 col-12 col-sm-6 col-md-4 col-lg-3">
                  <v-checkbox class="mt-0"
                    label="Хранение данных"
                    required
                    v-model="checkboxes.t"
                  ></v-checkbox>
                </v-col>
              </v-row>

              <v-text-field
                label="Максимальное количество регистраторов"
                type="number"
                v-model="regcount"
              ></v-text-field>

              <v-btn
                id="createKey"
                block
                color="primary"
                class="my-5"
                v-bind:loading="isFetchInProcess"
                v-on:click="submit($event)"
                v-on:pointerup="clipText($event)"
              >
                Создать
              </v-btn>

              <!-- v-bind:value="keysText" -->           
              <h4>Ключ</h4> 
              <v-textarea
                readonly
                auto-grow 
                v-bind:value="keysText"
              >
                <!-- {{keysText}} -->
              </v-textarea>

            </div>

          </v-form>

          <!--База данных -->
          <div class="pt-5 pb-10 pr-5 pl-5"
            v-else-if="form === Form.DATABASE">

      


            <!-- Вывод пути к текущей директории -->
            <div class="row flex-wrap pb-5 ml-0 mr-0 container-fluid">
                  <div class="flex-nowrap align-center ml-0 col-2 pl-0 mr-4"
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
                      <v-icon
                        color="gray"
                        >mdi-chevron-right
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
                v-if="isAdmin">
                  mdi-delete
                </v-icon>
              </v-row>
            
              <v-row  class="file-line d-flex align-center mb-6" 
                v-for="file of files">
                      <v-icon class="mr-2"
                      color="primary"
                      @click="openFileDialog(file)">
                        mdi-pencil
                      </v-icon>
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
                      v-if="isAdmin">
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

            <!-- Добавить папку -->
            <v-row class="pt-8 pb-10" v-if="isAdmin">
                <v-btn class="mr-4" color="success"
                @click="isCreatingFolder = isCreatingFolder === false ? true : false">
                  Добавить папку
                </v-btn>
                <v-col v-if="isCreatingFolder">
                  
                  <v-row class="d-flex align-center">
                    <v-text-field 
                    label="Название папки"
                    hide-details
                    v-model="nameNewDir"
                    v-on:keyup.enter="createDir"
                    ></v-text-field>
                    <v-btn class="ml-2"
                    color="green darken-1"
                    @click="createDir">
                      Создать папку
                    </v-btn>
                  </v-row>
                  
                </v-col>
              </v-row>
            

            <!-- Добавление новых файлов -->
            <div class="container mt-8">

              <div class="text-center pb-5">
                <h1>Добавить файлы</h1>
              </div>

              <form 
              id="form" 
              enctype="multipart/form-data">
                <v-row class="align-center" justify="space-around">
                    <div class="input-group">
                        <v-btn 
                        color="primary"
                        v-on:click="chooseFiles"
                        >
                          Выбрать
                        </v-btn>


                        <input style="display:none" v-on:change="filesPicked" id="fileinput" type="file" multiple />
                      <!--label style="background-color:lightblue" for="file">Нажмите для выбора файла</label-->
                        
                    </div>
                    <div id="fileinputlabel">
                      {{getUploadingFilesLabel()}}
                    </div>
                    <v-btn  
                      :disabled="uploadingFiles.length===0"
                      color="primary" v-on:click="sendFiles">
                      Добавить
                    </v-btn>
                </v-row>
              </form>
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
            </div>

          </div>

          <!--Пользователи -->
          <div class="pt-5 pb-10 pr-5 pl-5"
          v-else-if="isAdmin">

            

            <div class="mt-4 mb-2">
                  <v-row class="folder-line d-flex align-center mb-6 mr-14"> 
                    <v-col>
                      <span class="p-2 pl-7 ml-2">
                        Имя
                      </span>
                    </v-col> 
                    <v-col>
                      <span class="p-2">
                          Логин
                      </span>
                    </v-col>
                    <v-col>
                      <span class="p-2">
                          Роль
                      </span>
                    </v-col>
                    <v-divider></v-divider>
                  </v-row>
            </div>
            <!-- Вывод пользователей -->
            <div class="mt-4 mb-2">
                    <v-row class="folder-line d-flex align-center mb-6"  
                    v-for="user of users"> 
                    <v-col>
                      <span class="p-2 width">
                        <v-icon
                          color="primary"
                          size="24"
                          class="pa-0 mr-3">      
                          mdi-account
                        </v-icon>
                        <span class="p-2 text-primary">
                          {{user.name}}
                        </span>
                      </span>
                    </v-col> 
                    <v-col>
                      <span class="p-2">
                          {{user.userName}}
                      </span>
                    </v-col>
                    <v-col>
                      <span class="p-2">
                          {{user.roleName}}
                      </span>
                    </v-col>
                      <v-icon class="ml-3"
                      color="primary"
                      @click="openChangeUserDialog(user.id)"
                      v-if="isAdmin">
                        mdi-pencil
                      </v-icon>
                      <v-icon class="ml-3"
                      color="red darken-4"
                      @click="deleteUser(user.id)"
                      v-if="isAdmin">
                        mdi-delete
                      </v-icon>
                      <div v-else style="width:57px"></div>
                  </v-row>
            </div>

            <v-dialog
              v-model="changeUser.changeUserDialog"
              max-width="1200px"
            >
              <v-form class="change-user-dialog">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Редактировать пользователя</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-text-field
                            label="Логин"
                            placeholder="login"
                            required
                            v-model="changeUser.userName"
                            v-on:keyup.enter="sendChangeUser"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            label="Пароль"
                            required
                            v-model="changeUser.password"
                            v-on:keyup.enter="sendChangeUser"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-text-field
                            label="Имя"
                            required
                            hide-details
                            v-model="changeUser.name"
                            v-on:keyup.enter="sendChangeUser"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-select
                          label="Роль"
                          hide-details
                          v-model="changeUser.roleName"
                          :items="roleNames"
                          v-on:keyup.enter="sendChangeUser"
                          >
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeChangeUserDialog"
                  >
                    Закрыть
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="sendChangeUser"
                  >
                    Сохранить
                  </v-btn>
                </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>

            <div class="create-user pt-8"
            v-if="isAdmin">
              <v-btn class="mr-4 mb-4" color="success"
              @click="this.createUser.createUserForm = this.createUser.createUserForm === true ? false : true">
                <v-icon
                size="24"
                >
                  mdi-plus-box
                </v-icon>
              </v-btn>
              <v-form v-if="createUser.createUserForm">
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Создать пользователя</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col>
                          <v-text-field
                            label="Логин"
                            placeholder="login"
                            required
                            hide-details
                            v-model="createUser.userName"
                            v-on:keyup.enter="sendNewUser"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            label="Пароль"
                            required
                            hide-details
                            v-model="createUser.password"
                            v-on:keyup.enter="sendNewUser"
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            label="Имя"
                            required
                            hide-details
                            v-model="createUser.name"
                            v-on:keyup.enter="sendNewUser"
                          ></v-text-field>
                        </v-col>
                        <v-col class="role-col">
                          <v-select
                          label="Роль"
                          hide-details
                          v-model="createUser.roleName"
                          :items="roleNames"
                          v-on:keyup.enter="sendNewUser"
                          >
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue darken-1"
                    text
                    @click="closeCreateUserForm"
                  >
                    Отмена
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="sendNewUser"
                  >
                    Создать
                  </v-btn>
                </v-card-actions>
                </v-card>
              </v-form>
            </div>
          </div>
        </div>

      </div>




      <!-- Оповещение -->
      <div id="dialogbox" class="slit-in-vertical">
        <div>
          <div id="dialogboxbody"></div>
        </div>
      </div>
    </v-container>
  </v-app>
</template>
<script>
  const Form = {
  LOGIN: 0,
  MAIN: 1,
  DATABASE: 2,
  USERS: 3,
  };
  export default {
    data: () => ({
      uploadingFiles:[],
      folders: [],
      files: [],
      way:"dir_0",
      way_frontend:[{name: ':', id: 0}],

      currentDirId: 0,
      nameNewDir: '',

      form: Form.LOGIN,
      Form,

      drawer: false,
      group: null,

      nonces: [ '' ],
      regcount: '99',
      checkboxes: {
        n: true, s: true, o: true, v: true, e: true, m: true, a: true, t: true,
      },

      roles: [],
      roleNames: [],
      users: [],

      username: '',
      password: '',
      userId: null,
      isAdmin: false,
      isUnautorized: false,

      customer: '',
      additionalInfo: '',

      dirDialog: false,
      updateDirName: '',

      fileDialog: false,
      currentFileId: null,
      newFileName: '',
      newFileCaption: '',

      captionDialog: false,
      nameCaption: '',
      infoCaption: '',

      changeUser: {
        changeUserDialog: false,
        id: null,
        userName: '',
        name: '',
        password: '',
      },

      createUser: {
        createUserForm: false,
        userName: '',
        name: '',
        password: '',
        roleName: 'Пользователь',
      },

      errorDescription: 'Ошибка',

      isFileLoading: false,
      isAlertVisible: false,
      isAddingFilesVisible: false,
      isFetchSuccess: false,
      isFetchInProcess: false,
      isCreatingFolder: false,
      keys: [],
      keysText: '',
    }),

    mounted() {
    },

    watch: {
      group () {
        this.drawer = false
      },
    },

    methods: {
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
      async login() {
        const user = {
          username: this.username,
          password: this.password
        }
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(user)
        })
        
        if (response.status === 200) {
          const data = await response.json()      
          this.userId = data.user_id
          this.toMain()
          this.getRoles()
          const user = await this.getUser(this.userId)
          this.isAdmin = this.roles.find(role => role.id === user.role_id).is_admin
        }
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      async logout() {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/logout`, {
          method: 'POST'
        })    
        if (document.cookie) document.cookie = "name=user;expires=" + cookie_date.toUTCString()
        this.drawer = false
        this.username = ''
        this.password = ''
        this.form = Form.LOGIN
      },
      toMain() {
        this.form = Form.MAIN
        this.drawer = false
      },
      toDB(){
        this.getDir(0);
        this.form=Form.DATABASE
        this.drawer = false
      },
      toUsers() {
        this.getUsers()
        this.form = Form.USERS
        this.drawer = false
      },
      async getRoles() {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/roles`)
        const data = await response.json()

        if (response.status === 200) {
          this.roles = data
          this.roleNames = data.concat().map(role => {
            return role.name
          })
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      async getDir(id) {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/dirs/${id}`)
        const data = await response.json()


        if (response.status === 200) {  
          this.folders = data.dirs
          this.files = data.files
          this.files.push({id: 1, name: 'test', caption: 'Описание'})
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
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
          this.isCreatingFolder = false
          this.getDir(this.currentDirId)
          // this.folders.push({name: `${this.nameNewDir}`, id: data.id})
          this.nameNewDir = ''
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
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
          this.logout()   
        } 
        if (response.status === 500) {
          // const error = await response.json()
          // this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        } 
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
          this.logout()   
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
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      openDirDialog(dirId, dirName) {
        this.updateDirName = dirName
        this.dirDialog = true
        this.updateDirId = dirId
      },
      closeDirDialog() {
        this.updateDirName = ''
        this.dirDialog = false
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
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      roleIdToName(idx) {
        return this.roles.find(role => role.id === idx).name
      }, 
      roleNameToId(roleName) {
        return this.roles.find(role => role.name === roleName).id
      }, 
      async getUsers() {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/users`)
        const data = await response.json()
        
        if (response.status === 200) {
          this.users = data.map(user => {
            return {
              id: user.id,
              roleId: user.role_id,
              roleName: this.roleIdToName(user.role_id),
              userName: user.username,
              name: user.name,
            }
          })                  
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      async getUser(id) {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/users/${id}`)
        const data = await response.json()
        
        if (response.status === 200) {
          return data
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }  
      },
      async deleteUser(id) {
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/users/${id}`, {
          method: 'DELETE'
        })
        
        if (response.status === 200) {
          this.getUsers() //или
          //this.users.splice(this.users.indexOf(id), 1)
          this.customAlert('Пользователь удалён')
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        } 
      },
      async sendNewUser() {
        const newUser = {
          role_id: this.roleNameToId(this.createUser.roleName),
          username: this.createUser.userName,
          name: this.createUser.name,
          password: this.createUser.password
        }
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(newUser)
        })

        if(response.status === 200) {    
          this.getUsers()
          this.closeCreateUserForm()
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      closeCreateUserForm() {
        this.createUser = {
          createUserForm: false,
          name: '',
          userName: '',
          password: '',
          roleName: 'Пользователь'
        }
      },
      async sendChangeUser() {
        const id = this.changeUser.id
        const updatedUser = {
          role_id: this.roleNameToId(this.changeUser.roleName),
          username: this.changeUser.userName,
          name: this.changeUser.name,
          password: this.changeUser.password
        }
        const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(updatedUser)
        })
        

          if(response.status === 200) {
          // const data = await response.json()      
          this.getUsers()
          this.closeChangeUserDialog()
        } 
        if (response.status === 401) {
          this.username = ''
          this.password = ''
          this.logout()   
        } 
        if (response.status === 500) {
          const error = await response.json()
          this.errorDescription = error.ErrorDescription
          this.customAlert(this.errorDescription)
        }
      },
      async openChangeUserDialog(userId) {
        const user  =  await this.getUser(userId)
        this.changeUser = {
          changeUserDialog: true,
          id: user.id,
          name: user.name,
          userName: user.username,
          password: user.password,
          roleName: this.roleIdToName(user.role_id)
        }
      },
      closeChangeUserDialog() {
        this.changeUser = {
          changeUserDialog: false,
          id: null,
          name: '',
          userName: '',
          roleId: null,
          password: '',
          roleName: ''
        }
      },
      clipboardKey (e) { 
        navigator.clipboard.writeText(this.keysText)
        console.log(e)
       },
      clipText(e) {
        console.log(this.keys)
        
        setTimeout(()=>{
          console.log(this.keys, 'иЗ КОПИРОВАНИЯ')
          navigator.clipboard.writeText(this.keysText)
        },5) 
      },
      async submit(e) {
        // console.log('sf')
        // console.log(this.keysText)
        // this.keysText = 'Копирует2'
        // console.log(this.keysText)
          

       if(document.getElementById("customerfield").value==""){
        alert("Введите заказчика!")
        return;
       }else if(document.getElementById("noncefield").value==""){
        alert("Введите ключ запроса!")
        return;
       }
        this.isAlertVisible = false
        this.isFetchInProcess = true
        this.isUnautorized = false

        const noncePropery = this.nonces.map(nonce => nonce.replace(/\s/g, '')).join(',')

        
          const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/key?nonce=${ noncePropery }&regcount=${ this.regcount }&options=${ this.options }&company=${ this.customer }&reason=${ this.additionalInfo }`)
          
          if (response.status == 401) {
            this.username = ''
            this.password = ''
            this.logout()   
            return
          }

          this.keys = await response.json()

          this.keysText = this.keys.map(key => `${ key.first }|${ key.second }`).join('\r\n')

          

          
          // try {
          //   navigator.clipboard.writeText(this.keysText)
          // } catch(e) {}

          this.isFetchSuccess = true
        

        this.isFetchInProcess = false
        this.isAlertVisible = true

        setTimeout(() => {
          this.isAlertVisible = false
        }, 1500)
      },
      addNewNonce() {
        this.nonces.push('')
      },
      removeNonce(idx) {
        this.nonces.splice(idx, 1)
      },
      chooseFiles() {
        document.getElementById("fileinput").click()
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
      filesPicked() {
        this.isFileLoading = true
        console.log('picked files')
        let inputFile=document.getElementById('fileinput');
        this.uploadingFiles=inputFile.files
        setTimeout(()=>this.isFileLoading = false, 0)       
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
        
        // const response = {
        //   status: 201
        // }
        
        if(response.status === 201) {    
        this.isFileLoading = false
        this.getDir(this.currentDirId)
        } 
        if (response.status === 401) {
          this.isFileLoading = false
          this.username = ''
          this.password = ''
          this.logout()   
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
    },

    computed: {
      options() {
        let result = ''
        
        const keys = ['n', 's', 'o', 'v', 'e', 'm', 'a', 't' ]

        keys.forEach(key => {
          result += this.checkboxes[key] ? key : '.'
        })

        return result
      },
    }
  }
</script>

<style>
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