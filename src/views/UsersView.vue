<template>
    <div style="padding-left: 20px; padding-top: 100px;" v-if="access.users > 0">
        <div class="pt-5 pb-10 pr-5">
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
                </v-row>
            </div>
            <!-- Вывод пользователей -->
            <div class="mt-4 mb-2">
                <v-row class="folder-line d-flex align-center mb-6" v-for="user of users">
                    <v-col>
                        <span class="p-2 width">
                            <v-icon color="primary" size="24" class="pa-0 mr-3">
                                mdi-account
                            </v-icon>
                            <span class="p-2 text-primary">
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
                    <v-icon class="ml-3" color="primary" @click="openChangeUserDialog(user.id)" v-if="access.users > 1">
                        mdi-pencil
                    </v-icon>
                    <div v-else style="width:57px"></div>
                    <v-icon class="ml-3" color="delete darken-4" @click="deleteUser(user.id)" v-if="access.users > 2">
                        mdi-delete
                    </v-icon>
                    <div v-else style="width:57px"></div>
                </v-row>
            </div>

            <v-dialog v-model="changeUser.changeUserDialog" max-width="1200px">
                <v-form class="change-user-dialog">
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">Редактировать пользователя</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-text-field label="Логин" placeholder="login" required
                                            v-model="changeUser.userName" v-on:keyup.enter="sendChangeUser"></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field label="Пароль" required v-model="changeUser.password"
                                            v-on:keyup.enter="sendChangeUser"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <v-text-field label="Имя" required hide-details v-model="changeUser.name"
                                            v-on:keyup.enter="sendChangeUser"></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-select label="Роль" hide-details v-model="changeUser.roleName" :items="roleNames"
                                            v-on:keyup.enter="sendChangeUser">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeChangeUserDialog">
                                Закрыть
                            </v-btn>
                            <v-btn color="green darken-1" text @click="sendChangeUser">
                                Сохранить
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
            </v-dialog>

            <div class="create-user pt-8" v-if="access.users > 1">
                <v-btn  
                  color="add-new"
                  class="create-user__button" 
                  @click="this.createUser.createUserForm = this.createUser.createUserForm === true ? false : true">
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
                                    <v-col>
                                        <v-text-field label="Логин" placeholder="login" required hide-details
                                            v-model="createUser.userName" v-on:keyup.enter="sendNewUser"></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field label="Пароль" required hide-details v-model="createUser.password"
                                            v-on:keyup.enter="sendNewUser"></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field label="Имя" required hide-details v-model="createUser.name"
                                            v-on:keyup.enter="sendNewUser"></v-text-field>
                                    </v-col>
                                    <v-col class="role-col">
                                        <v-select label="Роль" hide-details v-model="createUser.roleName" :items="roleNames"
                                            v-on:keyup.enter="sendNewUser">
                                        </v-select>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeCreateUserForm">
                                Отмена
                            </v-btn>
                            <v-btn color="green darken-1" text @click="sendNewUser">
                                Создать
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-form>
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
    async mounted() {
    //   await this.getRoles()
    //   await this.getUsers()
    },

    computed: {
      ...mapState(useAuthStore, {
        access: 'access'
      }),
    },

    data: () => ({
        isAdmin: true,
        errorDescription: 'Ошибка',
        users: [],
        roles: [],
        roleNames: [
        ],
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
    }),

    methods: {
        async toLogout() {
            await logout()
        },
        roleIdToName(idx) {
            return this.roles.find(role => role.id === idx).name
        },
        roleNameToId(roleName) {
            return this.roles.find(role => role.name === roleName).id
        },
        async getRoles() {
            const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/roles`)

            if (response.status === 200) {
                const data = await response.json()
                this.roles = data
                this.roleNames = data.concat().map(role => {
                    return role.name
                })
            }
            if (response.status === 401) {
                this.username = ''
                this.password = ''
                await this.toLogout()
            }
            if (response.status === 500) {
                const error = await response.json()
                this.errorDescription = error.ErrorDescription
                // this.errorDescription = 'Ролей нет'
                this.customAlert(this.errorDescription)
            }
        },
        async getUsers() {
            const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/users`)
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
                await this.toLogout()
            }
            if (response.status === 500) {
                const error = await response.json()
                this.errorDescription = error.ErrorDescription
                this.customAlert(this.errorDescription)
            }
        },
        async getUser(id) {
            const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`)
            const data = await response.json()

            if (response.status === 200) {
                return data
            }
            if (response.status === 401) {
                this.username = ''
                this.password = ''
                await this.toLogout()
            }
            if (response.status === 500) {
                const error = await response.json()
                this.errorDescription = error.ErrorDescription
                this.customAlert(this.errorDescription)
            }
        },
        async deleteUser(id) {
            const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`, {
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
                await this.toLogout()
            }
            if (response.status === 500) {
                const error = await response.json()
                this.errorDescription = error.ErrorDescription
                this.customAlert(this.errorDescription)
            }
        },
        async sendNewUser() {
            const newUser = {
                id: 0,
                role_id: this.roleNameToId(this.createUser.roleName),
                username: this.createUser.userName,
                name: this.createUser.name,
                password: this.createUser.password
            }
            const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(newUser)
            })

            if (response.status === 200) {
                this.getUsers()
                this.closeCreateUserForm()
            }
            if (response.status === 401) {
                this.username = ''
                this.password = ''
                await this.toLogout()
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
                password: this.changeUser.password === '******' ? '' :this.changeUser.password,
                id: 0,
            }
            const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}api/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(updatedUser)
            })


            if (response.status === 200) {
                // const data = await response.json()      
                this.getUsers()
                this.closeChangeUserDialog()
            }
            if (response.status === 401) {
                this.username = ''
                this.password = ''
                await this.toLogout()
            }
            if (response.status === 500) {
                const error = await response.json()
                this.errorDescription = error.ErrorDescription
                this.customAlert(this.errorDescription)
            }
        },
        async openChangeUserDialog(userId) {
            const user = await this.getUser(userId)
            this.changeUser = {
                changeUserDialog: true,
                id: user.id,
                name: user.name,
                userName: user.username,
                password: '******',
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