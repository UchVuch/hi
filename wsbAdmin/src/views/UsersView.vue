<template>
  <div
    v-if="access.users > 0"
    style="padding: 10vh 10px 10px 10px"
  >
    <div
      v-if="access.users > 1 && !isMobile"
      class="create-user pt-5"
    >
      <v-btn
        color="add-new"
        class="create-user__button"
        title="Добавить пользователя"
        @click="
          createUser.createUserForm =
            createUser.createUserForm === true ? false : true
        "
      >
        <v-icon size="24">
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
                <v-col
                  cols="12"
                  md="3"
                >
                  <v-text-field
                    v-model="createUser.userName"
                    label="Логин"
                    required
                    hide-details
                    @keyup.enter="sendNewUser"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                >
                  <v-text-field
                    v-model="createUser.password"
                    label="Пароль"
                    required
                    hide-details
                    @keyup.enter="sendNewUser"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                >
                  <v-text-field
                    v-model="createUser.name"
                    label="Имя"
                    required
                    hide-details
                    @keyup.enter="sendNewUser"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                >
                  <v-select
                    v-model="createUser.roleName"
                    label="Роль"
                    hide-details
                    :items="roleNames"
                    @keyup.enter="sendNewUser"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="close-modal"
              text
              @click="closeCreateUserForm"
            >
              Отмена
            </v-btn>
            <v-btn
              color="add-new"
              text
              @click="sendNewUser"
            >
              Создать
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </div>
    <!-- <div class="pt-2 pb-10 pr-2">
        <div class="mt-4 mb-2">
            <v-row class="folder-line d-flex align-center mb-6 mr-2">
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
            </v-row>
        </div>
        <div class="mt-4 mb-2">
            <v-row class="folder-line d-flex align-center mb-6" v-for="user of users">
                <v-col>
                    <span class="p-2 width">
                        <v-icon size="24" class="pa-0 mr-3" v-if="!isMobile">
                            mdi-account
                        </v-icon>
                        <span class="p-2">
                            {{ user.name }}
                        </span>
                    </span>
                </v-col>
                <v-col>
                    <span class="p-2">
                        {{ user.userName }}
                    </span>
                </v-col>
                <v-col>
                    <span class="p-2">
                        {{ user.roleName }}
                    </span>
                </v-col>
                <v-icon class="ml-3" color="primary" title="Редактировать" @click="openChangeUserDialog(user.id)" v-if="access.users > 1 && !isMobile">
                    mdi-pencil
                </v-icon>
                <div v-else style="width:57px"></div>
                <v-icon class="ml-3" color="delete" title="Удалить" @click="deleteUser(user.id)" v-if="access.users > 2 && !isMobile">
                    mdi-delete
                </v-icon>
                <div v-else style="width:57px"></div>
            </v-row>
        </div> 
    </div> -->

    <v-table>
      <thead>
        <tr>
          <th>Имя</th>
          <th>Логин</th>
          <th>Роль</th>
          <th v-if="!isMobile" />
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="users.length === 0"
          class="data-none"
        >
          Пользователей нет
        </tr>
        <tr
          v-for="user in users"
          v-else
          :key="user.id"
        >
          <td>
            <v-icon
              v-if="!isMobile"
              size="24"
              class="pa-0 mr-3"
            >
              mdi-account
            </v-icon>
            {{ user.name }}
          </td>
          <td>
            {{ user.userName }}
          </td>
          <td>
            {{ user.roleName }}
          </td>
          <td
            v-if="!isMobile"
            class="d-flex align-center justify-end"
          >
            <v-icon
              v-if="access.users > 1"
              class="ml-3"
              color="primary"
              title="Редактировать"
              @click="openChangeUserDialog(user.id)"
            >
              mdi-pencil
            </v-icon>
            <div
              v-else
              style="width: 57px"
            />
            <v-icon
              v-if="access.users > 2"
              class="ml-3"
              color="delete"
              title="Удалить"
              @click="deleteUser(user.id)"
            >
              mdi-delete
            </v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog
      v-model="changeUser.changeUserDialog"
      max-width="1200px"
      :width="isMobile ? '90%' : '60%'"
    >
      <v-form class="change-user-dialog">
        <v-card>
          <v-card-title>
            <span class="text-h5">Редактировать пользователя</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="changeUser.userName"
                    label="Логин"
                    required
                    @keyup.enter="sendChangeUser"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="changeUser.password"
                    label="Пароль"
                    required
                    @keyup.enter="sendChangeUser"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="changeUser.name"
                    label="Имя"
                    required
                    hide-details
                    @keyup.enter="sendChangeUser"
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-select
                    v-model="changeUser.roleName"
                    label="Роль"
                    hide-details
                    :items="roleNames"
                    @keyup.enter="sendChangeUser"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="close-modal"
              text
              @click="closeChangeUserDialog"
            >
              Закрыть
            </v-btn>
            <v-btn
              color="primary"
              text
              @click="sendChangeUser"
            >
              Сохранить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <div
      id="dialogbox"
      class="slit-in-vertical"
    >
      <div>
        <div id="dialogboxbody" />
      </div>
    </div>
  </div>
</template>

<script>
import { logout, customFetch } from '@/api'

import { mapState } from 'pinia'
import { useAuthStore } from '@/plugins/store/auth'

export default {
  async mounted() {
    await this.getRoles()
    await this.getUsers()
    this.createUser.roleName = this.roleNames[0]
  },

  computed: {
    ...mapState(useAuthStore, {
      isMobile: 'isMobile',
      access: 'access',
    }),
  },

  data: () => ({
    isAdmin: true,
    errorDescription: 'Ошибка',
    users: [],
    roles: [],
    roleNames: ['0', '1', '2'],
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
      roleName: '',
    },
  }),

  methods: {
    async toLogout() {
      await logout()
    },
    roleIdToName(idx) {
      return this.roles.find((role) => role.id === idx).name
    },
    roleNameToId(roleName) {
      return this.roles.find((role) => role.name === roleName).id
    },
    async getRoles() {
      const response = await fetch(
        `${import.meta.env.VITE_VUE_APP_SERVER}api/roles`,
      )

      if (response.status === 200) {
        const data = await response.json()
        this.roles = data.data
        this.roleNames = data.data.concat().map((role) => {
          return role.name
        })
        return
      }
      if (response.status === 401) {
        this.username = ''
        this.password = ''
        await this.toLogout()
        return
      }
      if (response.status === 500) {
        const error = await response.json()
        this.errorDescription = error.error_text
        // this.errorDescription = 'Ролей нет'
        this.customAlert(this.errorDescription)
        return
      } else {
        const error = await response.json()
        this.errorDescription = error.error_text
        this.customAlert(this.errorDescription)
      }
    },
    async getUsers() {
      const response = await fetch(
        `${import.meta.env.VITE_VUE_APP_SERVER}api/users`,
      )
      const { data } = await response.json()

      if (response.status === 200) {
        this.users = data.map((user) => {
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
        await this.toLogout()
        return
      }
      if (response.status === 500) {
        const error = await response.json()
        this.errorDescription = error.error_text
        this.customAlert(this.errorDescription)
      } else {
        const error = await response.json()
        this.errorDescription = error.error_text
        this.customAlert(this.errorDescription)
      }
    },
    async getUser(id) {
      const response = await fetch(
        `${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`,
      )
      const data = await response.json()

      if (response.status === 200) {
        return data
      }
      if (response.status === 401) {
        this.username = ''
        this.password = ''
        await this.toLogout()
        return
      }
      if (response.status === 500) {
        const error = await response.json()
        this.errorDescription = error.error_text
        this.customAlert(this.errorDescription)
      } else {
        const error = await response.json()
        this.errorDescription = error.error_text
        this.customAlert(this.errorDescription)
      }
    },
    async deleteUser(id) {
      const response = await fetch(
        `${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`,
        {
          method: 'DELETE',
        },
      )

      if (response.status === 200) {
        this.getUsers() //или
        //this.users.splice(this.users.indexOf(id), 1)
        this.customAlert('Пользователь удалён')
        return
      }
      if (response.status === 401) {
        this.username = ''
        this.password = ''
        await this.toLogout()
        return
      }
      if (response.status === 500) {
        const error = await response.json()
        this.errorDescription = error.error_text
        this.customAlert(this.errorDescription)
      } else {
        const error = await response.json()
        this.errorDescription = error.error_text
        this.customAlert(this.errorDescription)
      }
    },
    async postNewUser(newUser) {
      const res = await fetch(
        `${import.meta.env.VITE_VUE_APP_SERVER}api/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(newUser),
        },
      )
      return res
    },
    async sendNewUser() {
      const newUser = {
        id: 0,
        role_id: this.roleNameToId(this.createUser.roleName),
        username: this.createUser.userName,
        name: this.createUser.name,
        password: this.createUser.password,
      }
      await customFetch(this, this.postNewUser, newUser)
      this.getUsers()
      this.closeCreateUserForm()
    },
    closeCreateUserForm() {
      this.createUser = {
        createUserForm: false,
        name: '',
        userName: '',
        password: '',
        roleName: 'Пользователь',
      }
    },
    async putNewUser(updatedUser, id) {
      const res = await fetch(
        `${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify(updatedUser),
        },
      )
      return res
    },
    async sendChangeUser() {
      const id = this.changeUser.id
      const updatedUser = {
        role_id: this.roleNameToId(this.changeUser.roleName),
        username: this.changeUser.userName,
        name: this.changeUser.name,
        password:
          this.changeUser.password === '******' ? '' : this.changeUser.password,
        id: 0,
      }
      await customFetch(this, this.putNewUser, updatedUser, id)
      this.getUsers()
      this.closeChangeUserDialog()
    },
    async openChangeUserDialog(userId) {
      const user = await this.getUser(userId)
      this.changeUser = {
        changeUserDialog: true,
        id: user.id,
        name: user.name,
        userName: user.username,
        password: '******',
        roleName: this.roleIdToName(user.role_id),
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
        roleName: '',
      }
    },
    customAlert(message) {
      const dialogbox = document.getElementById('dialogbox')

      dialogbox.style.top = '50px'
      dialogbox.style.right = '15px'

      dialogbox.style.display = 'block'

      document.getElementById('dialogboxbody').textContent = message

      setTimeout(() => {
        dialogbox.style.animationName = 'slit-in-fade'
      }, 1400)
      setTimeout(() => {
        dialogbox.style.animationName = 'slit-in-vertical'
        dialogbox.style.display = 'none'
      }, 1600)
    },
  },
}
</script>

<style scoped>
.data-none {
  height: 150px;
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}

.folder-line {
  border-bottom: 1px solid #242424;
}

.create-user {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-user__button {
  align-self: flex-end;
  margin-bottom: 12px;
  margin-right: 4px;
}

#dialogbox {
  display: none;
  position: absolute;
  z-index: 10;
  top: 0;
  right: 0;
  color: #fff;
  background: rgb(23, 22, 22);
  border-radius: 8px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.575);
  transition: 0.3s;
  min-width: 250px;
  max-width: 450px;
  border-left: 4px solid rgb(194, 14, 14);
  /* border-left: 4px solid rgb(var(--v-theme-error)); */
  padding: 16px;
  word-wrap: break-word;
}

#dialogbox:hover {
  box-shadow: 0 8px 16px 0 rgba(28, 27, 27, 0.911);
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
