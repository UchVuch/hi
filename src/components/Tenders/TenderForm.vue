<template>
  <div>
    <v-card style="overflow-y: auto;">
      <v-card-title>
        <span class="text-h5" v-if="isNewTender">Новый тендер</span>
        <span class="text-h5" v-else>Тендер</span>
      </v-card-title>
      <v-tabs v-model="tab" fixed-tabs>
        <v-tab value="contract"> <v-icon class="mr-2" size="large" icon="mdi-check-circle" title="Этап активен"
            color="success"></v-icon> Подписание</v-tab>
        <v-tab value="shipment">
          <v-icon class="mr-2" size="large" icon="mdi-check-circle" width="30" v-if="stage > 0" title="Этап активен"
            color="success"></v-icon>
          <v-icon class="mr-2" size="large" icon="mdi-minus-circle" v-else title="Этап неактивен" color="error"></v-icon>
          Отгрузка
        </v-tab>
        <v-tab value="inspection">
          <v-icon class="mr-2" size="large" icon="mdi-check-circle" width="30" v-if="stage > 1" title="Этап активен"
            color="success"></v-icon>
          <v-icon class="mr-2" size="large" icon="mdi-minus-circle" v-else title="Этап неактивен" color="error"></v-icon>
          Приемка
        </v-tab>
      </v-tabs>
      <v-window v-model="tab" style="overflow-y: auto; height: 75vh;">
        <v-window-item value="contract">
          <v-card-text>
            <v-container>
              <v-form ref="form1">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="contract.seller_name" label="Имя продавца"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="contract.customer_name" label="Имя клиента"></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="contract.number" label="Номер договора" hint="Укажите целое число"
                      :rules="notDecimal" persistent-hint></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="contract.date" :rules="isValidDate" label="Дата"
                      hint="Дата в формате дд.мм.гггг — 02.06.2023" persistent-hint></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Условия</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.terms.date" :rules="isValidDate" label="Дата"
                          hint="Дата в формате дд.мм.гггг — 02.06.2023" persistent-hint></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.terms.note" label="Примечание"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Контракт</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.procuring.contract.amount" label="Сумма"
                          hint="Десятичные значения указываются через точку, например 350.05"
                          persistent-hint></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.procuring.contract.date" :rules="isValidDate" label="Дата"
                          hint="Дата в формате дд.мм.гггг — 02.06.2023" persistent-hint></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Гарантия</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.procuring.guarantee.amount" label="Сумма"
                          hint="Десятичные значения указываются через точку, например 350.05"
                          persistent-hint></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.procuring.guarantee.date" :rules="isValidDate" label="Дата"
                          hint="Дата в формате дд.мм.гггг — 02.06.2023" persistent-hint></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <p class="line-title">Адреcа и контакты</p>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.addresses" label="Адрес" persistent-hint></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field v-model="contract.contacts" label="Контакт" persistent-hint></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      <span class="mr-4 line-title">Оборудование</span>
                      <v-btn color="primary" title="Добавить" @click="addEquipment" v-if="access.tenders > 1">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <template v-for="item in contract.equipment">
                      <div class="pa-2 d-flex align-center justify-space-between">
                        <div class="text-h6">{{ item?.name }} {{ item?.variation }}<span v-if="item.price || item.count">
                            —
                            {{ item?.price }} руб / {{ item?.count }} шт</span></div>
                        <div class="d-flex ml-4" style="margin-left: auto;">
                          <v-btn v-if="access.tenders > 1" @click="editEqipment(contract.equipment.indexOf(item), item)"
                            color="primary" title="Изменить"><v-icon icon="mdi-pencil"></v-icon></v-btn>
                          <v-btn v-if="access.tenders > 2" @click="deleteEqipment(contract.equipment.indexOf(item))"
                            color="delete" title="Удалить" class="ml-2"><v-icon icon="mdi-delete"></v-icon></v-btn>
                        </div>
                      </div>
                    </template>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
        </v-window-item>

        <v-window-item value="shipment">
          <v-card-text>
            <v-container>
              <v-row v-if="stage === 0 && access.tenders > 1">
                <v-col cols="12">
                  <v-btn color="primary" variant="text" block @click="stage = 1">
                    Начать этап
                  </v-btn>
                </v-col>
              </v-row>
              <v-form ref="form2" v-if="stage > 0">
                <v-row>
                  <v-col cols="12">
                    <v-text-field v-model="shipment.date" :rules="isValidDate" label="Дата"
                      hint="Дата в формате дд.мм.гггг — 02.06.2023" persistent-hint></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <div>
                      <span class="mr-4 line-title">Оборудование</span>
                      <v-btn color="primary" title="Добавить" @click="addEquipment" v-if="access.tenders > 1">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <template v-for="item in shipment.equipment">
                      <div class="pa-2 d-flex align-center justify-space-between">
                        <div class="text-h6">{{ item?.name }} {{ item?.variation }}<span v-if="item.price || item.count">
                            —
                            {{ item?.price }} руб / {{ item?.count }} шт</span></div>
                        <div class="d-flex ml-4" style="margin-left: auto;">
                          <v-btn v-if="access.tenders > 1" @click="editEqipment(shipment.equipment.indexOf(item), item)"
                            color="primary" title="Изменить"><v-icon icon="mdi-pencil"></v-icon></v-btn>
                          <v-btn v-if="access.tenders > 2" @click="deleteEqipment(shipment.equipment.indexOf(item))"
                            color="delete" title="Удалить" class="ml-2"><v-icon icon="mdi-delete"></v-icon></v-btn>
                        </div>
                      </div>
                    </template>
                  </v-col>
                  <v-col cols="12">
                    <div v-if="isNewTender" class="mb-2">*Файлы можно загрузить после создания тендера</div>
                    <div class="d-flex justify-space-between">
                      <span class="mr-4 line-title">ТК</span>
                      <v-btn color="primary" title="Добавить файл"
                        @click="addNewPhoto('ТК', 'tk_media')" v-if="access.tenders > 1 && !isNewTender">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <div v-if="tk_media" class="d-flex flex-wrap">
                      <v-row class="mt-4">
                        <template v-for="file in tk_media">
                          <template v-if="isImage(file)">
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <img :src="`${mediaContentPath}${id}/tk_media/${file.name}?as_photo=true`" width="40" height="40" class="mr-4 image-mini" @click="openWatchImage(file.name)" title="Посмотреть фото">
                                <span class="mr-3 media-file__name" :title="file.name"> {{ file.name }} </span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn class="mr-3" color="primary" size="small" title="Посмотреть фото"  @click="openWatchImage(`${mediaContentPath}${id}/tk_media/${file.name}?as_photo=true`)">
                                    <v-icon icon="mdi-eye"></v-icon>
                                  </v-btn>
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/tk_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'tk_media')"
                                  >
                                    <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                          <template v-else>
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <v-icon icon="mdi-file"></v-icon>
                                <span class="mr-3 media-file__name" :title="file.name">{{ file.name }}</span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/tk_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'tk_media')"
                                  >
                                      <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                        </template>
                      </v-row>
                      <v-divider class="mt-4"></v-divider>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="d-flex justify-space-between">
                      <span class="mr-4 line-title">Квитанция</span>
                      <v-btn color="primary" title="Добавить файл"
                        @click="addNewPhoto('Квитанция', 'receipt_media')" v-if="access.tenders > 1 && !isNewTender">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <div v-if="receipt_media" class="d-flex flex-wrap">
                      <v-row class="mt-4">
                        <template v-for="file in receipt_media">
                          <template v-if="isImage(file)">
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <img :src="`${mediaContentPath}${id}/receipt_media/${file.name}?as_photo=true`" width="40" height="40" class="mr-4 image-mini" @click="openWatchImage(file.name)" title="Посмотреть фото">
                                <span class="mr-3 media-file__name" :title="file.name"> {{ file.name }} </span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn class="mr-3" color="primary" size="small" title="Посмотреть фото"  @click="openWatchImage(`${mediaContentPath}${id}/receipt_media/${file.name}?as_photo=true`)">
                                    <v-icon icon="mdi-eye"></v-icon>
                                  </v-btn>
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/receipt_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'receipt_media')"
                                  >
                                    <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                          <template v-else>
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <v-icon icon="mdi-file"></v-icon>
                                <span class="mr-3 media-file__name" :title="file.name">{{ file.name }}</span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/receipt_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'receipt_media')"
                                  >
                                      <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                        </template>
                      </v-row>
                      <v-divider class="mt-4"></v-divider>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="d-flex justify-space-between">
                      <span class="mr-4 line-title">Фото оборудования</span>
                      <v-btn color="primary" title="Добавить файл"
                        @click="addNewPhoto('Фото оборудования', 'equipment_media')" v-if="access.tenders > 1 && !isNewTender">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <div v-if="equipment_media" class="d-flex flex-wrap">
                      <v-row class="mt-4">
                        <template v-for="file in equipment_media">
                          <template v-if="isImage(file)">
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <img :src="`${mediaContentPath}${id}/equipment_media/${file.name}?as_photo=true`" width="40" height="40" class="mr-4 image-mini" @click="openWatchImage(file.name)" title="Посмотреть фото">
                                <span class="mr-3 media-file__name" :title="file.name"> {{ file.name }} </span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn class="mr-3" color="primary" size="small" title="Посмотреть фото"  @click="openWatchImage(`${mediaContentPath}${id}/equipment_media/${file.name}?as_photo=true`)">
                                    <v-icon icon="mdi-eye"></v-icon>
                                  </v-btn>
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/equipment_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'equipment_media')"
                                  >
                                    <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                          <template v-else>
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <v-icon icon="mdi-file"></v-icon>
                                <span class="mr-3 media-file__name" :title="file.name">{{ file.name }}</span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/equipment_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'equipment_media')"
                                  >
                                      <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                        </template>
                      </v-row>
                      <v-divider class="mt-4"></v-divider>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="d-flex justify-space-between">
                      <span class="mr-4 line-title">Бухгалтерия</span>
                      <v-btn color="primary" title="Добавить файл"
                        @click="addNewPhoto('Бухгалтерия', 'accounting_media')" v-if="access.tenders > 1 && !isNewTender">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <div v-if="accounting_media" class="d-flex flex-wrap">
                      <v-row class="mt-4">
                        <template v-for="file in accounting_media">
                          <template v-if="isImage(file)">
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <img :src="`${mediaContentPath}${id}/tk_media/${file.name}?as_photo=true`" width="40" height="40" class="mr-4 image-mini" @click="openWatchImage(file.name)" title="Посмотреть фото">
                                <span class="mr-3 media-file__name" :title="file.name"> {{ file.name }} </span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn class="mr-3" color="primary" size="small" title="Посмотреть фото"  @click="openWatchImage(`${mediaContentPath}${id}/accounting_media/${file.name}?as_photo=true`)">
                                    <v-icon icon="mdi-eye"></v-icon>
                                  </v-btn>
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/accounting_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'accounting_media')"
                                  >
                                    <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                            </template>
                          <template v-else>
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex align-center w-100 mb-3">
                                <v-icon icon="mdi-file"></v-icon>
                                <span class="mr-3 media-file__name" :title="file.name">{{ file.name }}</span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/accounting_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'accounting_media')"
                                  >
                                      <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                        </template>
                      </v-row>
                      <v-divider class="mt-4"></v-divider>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
        </v-window-item>

        <v-window-item value="inspection">
          <v-card-text>
            <v-container>
              <v-row v-if="stage < 2 && access.tenders > 1">
                <v-col cols="12">
                  <v-btn color="primary" variant="text" block @click="stage = 2">
                    Начать этап
                  </v-btn>
                </v-col>
              </v-row>
              <v-form ref="form2" v-if="stage > 1">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="inspection.penalties" label="Штрафы"
                      hint="Десятичные значения указываются через точку, например 350.05" persistent-hint></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="inspection.payment" label="Оплата"
                      hint="Десятичные значения указываются через точку, например 350.05" persistent-hint></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select v-model="inspection.approved" :items="['Да', 'Нет']" label="Одобрено — Да/Нет"></v-select>
                  </v-col>
                  <v-col cols="12">
                    <div v-if="isNewTender" class="mb-2">*Файлы можно загрузить после создания тендера</div>
                    <div class="d-flex align-center justify-space-between">
                      <div class="d-flex">
                        <span class="mr-4 line-title">Получение/подписание документов</span>
                        <v-checkbox v-model="inspection.getting_signing_documents" color="primary" class="pe-2"></v-checkbox>
                      </div>
                      <v-btn color="primary" title="Добавить файл"
                        @click="addNewPhoto('Получение/подписание документов', 'documents_media')"
                        v-if="access.tenders > 1 && inspection.getting_signing_documents && !isNewTender">
                        <v-icon size="large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </div>
                    <div v-if="documents_media && inspection.getting_signing_documents">
                      <v-row class="mt-4">
                        <template v-for="file in documents_media">
                          <template v-if="isImage(file)">
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex">
                                <img :src="file.name" width="40" height="40" class="mr-4 image-mini" @click="openWatchImage(`${mediaContentPath}${id}/documents_media/${file.name}?as_photo=true`)" title="Посмотреть фото">
                                <span class="mr-3 media-file__name" :title="file.name"> {{ file.name }} </span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn class="mr-3" color="primary" size="small" title="Посмотреть фото"  @click="openWatchImage(`${mediaContentPath}${id}/documents_media/${file.name}?as_photo=true`)">
                                    <v-icon icon="mdi-eye"></v-icon>
                                  </v-btn>
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/documents_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'documents_media')"
                                  >
                                    <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                          <template v-else>
                            <v-col cols="12" md="6" lg="4" xl="3">
                              <div class="d-flex">
                                <v-icon icon="mdi-file" size="x-large"></v-icon>
                                <span class="mr-3 media-file__name" :title="file.name">{{ file.name }}</span>
                                <div class="d-flex" style="margin-left:auto;">
                                  <v-btn :download="file.name" :href="`${mediaContentPath}${id}/documents_media/${file.name}`" color="add-new" size="small" title="Скачать файл">
                                    <v-icon icon="mdi-arrow-down-box"></v-icon>
                                  </v-btn>
                                  <v-btn 
                                    class="ml-3"
                                    color="delete"
                                    size="small"
                                    title="Удалить файл"
                                    @click="deleteFile(file.id, 'documents_media')"
                                    >
                                      <v-icon icon="mdi-delete"></v-icon>
                                  </v-btn>  
                                </div>
                              </div>
                            </v-col>
                          </template>
                        </template>
                      </v-row>
                      <v-divider class="mt-4"></v-divider>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
        </v-window-item>
      </v-window>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="close-modal" @click="closeTenderModal">
          Закрыть
        </v-btn>
        <v-btn color="primary" @click="saveStage" v-if="isNewTender && access.tenders > 1">
          Создать
        </v-btn>
        <v-btn color="primary" @click="saveStage" v-if="!isNewTender && access.tenders > 1">
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="watchImage" @keyup.esc="closeWatchImage">
      <div class="d-flex justify-end">
        <v-btn @click="enlargeWatchImage" class="mr-2" title="Увеличить" color="default" size="small"><v-icon icon="mdi-magnify-plus"></v-icon></v-btn>
        <v-btn @click="reduceWatchImage" class="mr-2" title="Уменьшить" color="default" size="small"><v-icon icon="mdi-magnify-minus"></v-icon></v-btn>
        <v-btn @click="closeWatchImage" title="Закрыть" color="default" size="small"><v-icon icon="mdi-close"></v-icon></v-btn>
      </div>
      <div style="overflow: auto; display: flex; justify-content: center; align-items: center; padding: 10px; width: 92w; height: 92vh;" @click="closeWatchImage">
        <img :src="currentWatchImage" alt="" id="image1" style="max-height: 90vh; max-width: 80vw;" @click.stop>
      </div>
    </v-dialog>

    <v-dialog v-model="dialogAddPhotos" width="500px">
      <div>
        <v-card>
          <v-card-title>
            <div class="input-group">
              <span>{{ currentField.name }}</span>
            </div>
          </v-card-title>
          <v-card-text>
              <v-btn color="add-new" @click="chooseFiles">
                Выберите файл
              </v-btn>
              <input  @change="filesPicked" id="fileinput" type="file"/>
              <!--label style="background-color:lightblue" for="file">Нажмите для выбора файла</label-->
              <v-dialog v-model="isFileLoading" hide-overlay persistent width="150" height="80">
                <v-card color="primary" dark>
                  <v-card-text>
                    Загрузка
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                  </v-card-text>
                </v-card>
              </v-dialog>
              <div class="mt-6">
                <div class="d-flex flex-column align-end" v-if="isUploading">
                  <div id="fileinputlabel">
                    {{ getUploadingFilesLabel() }}
                  </div>
                  <v-row class="mt-2">
                    <v-btn color="primary" :disabled="uploadingFiles.length === 0" v-on:click="sendFiles">
                      Добавить
                    </v-btn>
                  </v-row>
                </div>
              </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="close-modal" @click="closeDialogAddPhotos">
              Закрыть
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>

    <v-dialog v-model="dialogEquipment" width="55%">
      <TenderEquipmentForm @saveEqip="saveCurrentEqipment" @close="closeEditEquipment" :item="currentEqipment" />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/plugins/store/auth'

import validateDate from '@/helpers/validateDate'
import currentDate from '@/helpers/currentDate'
import formatToDate from '@/helpers/formatToDate'
import formatFromDate from '@/helpers/formatFromDate'

import TenderEquipmentForm from '../Tenders/TenderEquipmentForm.vue'

export default {
  components: { TenderEquipmentForm },
  name: "tender-form",
  props: {
    tender: {
      type: Object,
      required: true
    }
  },
  emits: ['close', 'save', 'create'],

  async mounted() {
    if (Object.keys(this.tender).length > 0) {

      this.tab = this.tender.stage
      this.id = this.tender.tender.id

      this.contract.seller_name = this.tender.tender.contract_seller_name
      this.contract.customer_name = this.tender.tender.contract_customer_name
      this.contract.procuring.contract.amount = this.tender.tender.contract_procuring.contract.amount.toString()
      this.contract.procuring.contract.date = formatToDate(this.tender.tender.contract_procuring.contract.date)
      this.contract.procuring.guarantee.amount = this.tender.tender.contract_procuring.guarantee.amount.toString()
      this.contract.procuring.guarantee.date = formatToDate(this.tender.tender.contract_procuring.guarantee.date)
      this.contract.equipment = [...this.tender.tender.contract_equipment]
      this.contract.number = this.tender.tender.contract_number.toString()
      this.contract.date = formatToDate(this.tender.tender.contract_date)
      this.contract.terms.date = formatToDate(this.tender.tender.contract_terms.date)
      this.contract.terms.text = this.tender.tender.contract_terms.text
      this.contract.addresses = this.tender.tender.contract_addresses.join(',')
      this.contract.contacts = this.tender.tender.contract_contacts.join(',')

      if (this.tender.tender.inspection_penalties >= 0) {
        this.inspection.penalties = this.tender.tender.inspection_penalties.toString()
        this.inspection.payment = this.tender.tender.inspection_payment.toString()
        this.inspection.approved = this.tender.tender.inspection_approved ? 'Да' : 'Нет'
        this.inspection.getting_signing_documents = this.tender.tender.inspection_getting_signing_documents
      } else {
        this.stage = 1
      }

      if (this.tender.tender.shipment_date) {
        this.shipment.date = formatToDate(this.tender.tender.shipment_date)
        this.shipment.equipment = [...this.tender.tender.shipment_equipment]
      } else {
        this.stage = 0
      }
      console.log(this.stage)
    } else {
      this.isNewTender = true
      this.id = 0
      this.stage = 0
    }

    // запросы ко всем папкам с медиа
    this.tk_media = await this.getFolderMedia(this.id, 'tk_media')
    this.receipt_media = await this.getFolderMedia(this.id, 'receipt_media')
    this.accounting_media = await this.getFolderMedia(this.id, 'accounting_media')
    this.equipment_media = await this.getFolderMedia(this.id, 'equipment_media')
    this.documents_media = await this.getFolderMedia(this.id, 'documents_media')
  },

  data: () => ({
    currentScale: 1,
    watchImage: false,
    currentWatchImage: '',

    isNewTender: false,
    tab: 'contract',
    getting_signing_documents: false,
    dialogEquipment: false,
    currentEqipment: {},
    dialogAddPhotos: false,
    currentField: {
      propertyName: '',
      name: 'Имя поля',
    },
    uploadingFiles: [],
    isUploading: false,
    isFileLoading: false,
    mediaContentPath: `api/files/path/media/tenders/`,
    tk_media: [],
    receipt_media: [],
    accounting_media: [],
    equipment_media: [],
    documents_media: [],
    imageExtensions: ['.jpg', '.jpeg', '.png', '.bmp', '.gif', '.avif', '.tif', '.eps', '.svg', '.pdf', '.ai', '.eps', '.psd', '.raw', '.webp', '.heic', '.hdr', '.dng', '.cdr','.tga'],

    isValidDate: [
      value => {
        return validateDate(value)
      }
    ],
    notDecimal: [
      value => {
        if (value.includes('.') || value.includes(',')) {
          return 'Номер договора не должен быть десятичным числом'
        }
        return true
      }
    ],
    required: [
      value => {
        if (value)
          return true;
        return "Заполните поле";
      },
    ],

    id: null,
    stage: 2,
    contract: {
      seller_name: '',
      customer_name: '',
      procuring: {
        contract: { amount: '0', date: formatToDate(currentDate()) },
        guarantee: { amount: '0', date: formatToDate(currentDate()) },
      },
      equipment: [],
      number: '0',
      date: formatToDate(currentDate()),
      terms: {
        date: formatToDate(currentDate()),
        note: '',
      },
      addresses: '',
      contacts: '',
    },
    shipment: {
      date: formatToDate(currentDate()),
      equipment: [],
    },
    inspection: {
      penalties: '0',
      payment: '0',
      approved: 'Нет',
      getting_signing_documents: false,
    },
  }),

  computed: {
    ...mapState(useAuthStore, {
      access: 'access'
    }),
  },

  methods: {
    enlargeWatchImage() {
      this.currentScale += 0.1
      document.getElementById('image1').style.transform = `scale(${this.currentScale})`
    },
    reduceWatchImage() {
      if (this.currentScale > 0.2) this.currentScale -= 0.1
      document.getElementById('image1').style.transform = `scale(${this.currentScale})`
    },
    openWatchImage(pathImage) {
      this.currentScale = 1
      this.watchImage = true
      this.currentWatchImage = pathImage
    },
    closeWatchImage() {
      this.watchImage = false
    },
    isImage(file) {
      return this.imageExtensions.some(extension => file.name.includes(extension))
    },
    async getFolderMedia(tenderId, folder) {
       const response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}${this.mediaContentPath}${tenderId}/${folder}`)
      if (response.status === 200) {
        const data = await response.json()
        return data.files
      }
      if (response.status === 404) {
        return []
      } 
    },
    addNewPhoto(name, property) {
      this.dialogAddPhotos = true
      this.currentField.name = name
      this.currentField.propertyName = property
    },
    closeDialogAddPhotos() {
      this.dialogAddPhotos = false
      document.getElementById('fileinput').setAttribute("value", null)
      document.getElementById('fileinputlabel').nodeValue = "Не выбрано"
      this.uploadingFiles = []
      this.isUploading = false
    },
    async deleteFile(id, folderName) {
      this.currentField.propertyName = folderName

      const response = await fetch(`${ import.meta.env.VITE_VUE_APP_SERVER }api/files/${id}`, {
        method: 'DELETE'
      })

      if (response.status === 200) {
        this[this.currentField.propertyName] = await this.getFolderMedia(this.id, this.currentField.propertyName)
      } 
      if (response.status === 401) {
        this.username = ''
        this.password = ''
        await logout()   
      } 
      if (response.status === 500) {
        const error = await response.json()
        this.errorDescription = error.ErrorDescription
        this.alert(this.errorDescription)
      } 
    },
    //загрузка новых файлов
    chooseFiles() {
      document.getElementById("fileinput").click()
    },
    filesPicked() {
      this.isFileLoading = true
      this.isUploading = true
      console.log('picked files')
      let inputFile = document.getElementById('fileinput');
      this.uploadingFiles = inputFile.files
      setTimeout(() => this.isFileLoading = false, 0)
    },
    getUploadingFilesLabel() {
      if (this.uploadingFiles.length === 0) {
        return 'Файлы не выбраны'
      }
      let s = ''
      for (const file of this.uploadingFiles) {
        if (s !== '') {
          s += ','
        }
        s += file.name
      }
      return s
    },
    async sendFiles() {
      this.isFileLoading = true
      const formData = new FormData()

      for (const file of this.uploadingFiles) {
        formData.append("files", file)
      }
      // JSON.stringify({way:this.way}) т.к. апи поменялось изменил это
      // на JSON.stringify({dir_id: this.currentDirId})

      for (var pair of formData.entries()) {
        console.log(pair)
      }

      const labelWithName = document.getElementById('fileinputlabel')

      formData.append("config", JSON.stringify(
        {
          name: `${labelWithName.textContent}`,
          caption: ''
        }
      ))
      let response = await fetch(`${import.meta.env.VITE_VUE_APP_SERVER}${this.mediaContentPath}${this.id}/${this.currentField.propertyName}`, {
        method: "post",
        body: formData,
      }).catch((error) => ("Something went wrong!", error))

      if (response.status === 200) {
        this.isFileLoading = false
        this[this.currentField.propertyName] = await this.getFolderMedia(this.id, this.currentField.propertyName)
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
        alert(this.errorDescription)
      }
      if (response.status === 404) {
        this.isFileLoading = false
        alert("Сервер не отвечает")
      } else if (response.status >= 400) {
        this.isFileLoading = false
        alert("Этот формат файла не поддерживается в данной папке!")
      }

      document.getElementById('fileinput').setAttribute("value", null)
      document.getElementById('fileinputlabel').nodeValue = "Не выбрано"
      this.uploadingFiles = []
      this.isUploading = false
      this.isFileLoading = false
      this.dialogAddPhotos = false
      this.currentField.name = ''
      this.currentField.propertyName = ''
    },
    closeTenderModal() {
      this.$emit('close')
    },
    formatTypeEquipment(array) {
      return array.map(item => {
        return {
          ...item,
          count: Number(item.count),
          price: Number(item.price),
        }
      })
    },
    saveStage() {
      const tender = {
        id: this.id,
        contract: {
          seller_name: this.contract.seller_name,
          customer_name: this.contract.customer_name,
          procuring: {
            contract: {
              amount: Number(this.contract.procuring.contract.amount),
              date: formatFromDate(this.contract.procuring.contract.date)
            },
            guarantee: {
              amount: Number(this.contract.procuring.guarantee.amount),
              date: formatFromDate(this.contract.procuring.guarantee.date)
            }
          },
          equipment: this.formatTypeEquipment(this.contract.equipment),
          number: Number(this.contract.number),
          date: formatFromDate(this.contract.date),
          terms: {
            date: formatFromDate(this.contract.terms.date),
            note: this.contract.terms.note,
          },
          addresses: this.contract.addresses.split(','),
          contacts: this.contract.contacts.split(',')
        },

        shipment: this.stage < 1 ? null : {
          date: formatFromDate(this.shipment.date),
          equipment: this.formatTypeEquipment(this.shipment.equipment),
        },
        inspection: this.stage < 2 ? null : {
          penalties: Number(this.inspection.penalties),
          payment: Number(this.inspection.payment),
          approved: this.inspection.approved === 'Да' ? true : false,
          getting_signing_documents: this.inspection.getting_signing_documents,
        },
      }
      if (this.isNewTender) {
        this.$emit('create', tender)
      } else {
        this.$emit('save', tender)
      }
    },
    closeEditEquipment() {
      this.dialogEquipment = false
    },
    addEquipment() {
      this[this.tab].equipment.push({ name: 'Новое оборудование', price: '', count: '', variation: '' })
    },
    deleteEqipment(index) {
      this[this.tab].equipment.splice(index, 1)
    },
    editEqipment(index, item) {
      this.currentEqipment = {
        index: index,
        ...item
      }
      this.dialogEquipment = true
    },
    saveCurrentEqipment(item) {
      this[this.tab].equipment[item.id] = item.value
      this.dialogEquipment = false
    }
  }
}
</script>

<style scoped>
.line-title {
  font-size: 20px;
  margin-block: 15px 10px;
}

#fileinput {
  display: none;
}

.image-mini {
  cursor: pointer;
  object-fit: cover;
}

.media-file__name {
  max-width: 50%;
  height: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>