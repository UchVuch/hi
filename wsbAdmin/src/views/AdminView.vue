<template>
  <div
    v-if="access.admin > 0"
    class="h-100"
    style="padding: 60px 35px 30px 20px"
  >
    <AdminRoles
      :roles="roles"
      class="mb-4"
      @edit="editRole"
      @create="createRole"
      @delete="deleteRole"
    />
    <AdminTags
      :tags="contractTags"
      class="mb-4"
      @create="createTag"
      @edit="editTag"
      @delete="deleteTag"
    />
    <!-- <AdminTags 
      :tags="tenderTags" 
      :tenderTags="true" 
      @create="createTag" 
      @edit="editTag" 
      @delete="deleteTag"
      class="mb-4"
    >
      <template v-slot:title>
        Теги для тендера
      </template>
      <template v-slot:hidden-title>
        Теги для тендера
      </template>
    </AdminTags> -->
    <AdminEquipVariations
      :items="equipVariations"
      @create="createEquipVariation"
      @edit="editEquipVariation"
      @delete="deleteEquipVariation"
    />
  </div>
</template>

<script>
import {
  customFetch,
  getRoles,
  postRole,
  putRole,
  deleteRole,
  getTags,
  postTag,
  putTag,
  deleteTag,
  getEquipVariations,
  postEquipVariation,
  putEquipVariation,
  deleteEquipVariation,
} from '@/api'
import { mapState } from 'pinia'
import { useAuthStore } from '@/plugins/store/auth'

import AdminRoles from '@/components/Admin/AdminRoles.vue'
import AdminTags from '@/components/Admin/AdminTags.vue'
import AdminEquipVariations from '@/components/Admin/AdminEquipVariations.vue'

export default {
  components: { AdminRoles, AdminTags, AdminEquipVariations },

  data: () => ({
    roles: [],
    contractTags: [],
    tenderTags: [],
    equipVariations: [],
  }),

  async mounted() {
    this.getRoles()
    this.getTags()
    this.getEquipVariations()
  },

  computed: {
    ...mapState(useAuthStore, {
      access: 'access',
    }),
  },

  methods: {
    async getRoles() {
      const res = await customFetch(this, getRoles)
      if (res.data) this.roles = [...res.data]
    },
    async getTags() {
      const contractTags = await customFetch(this, getTags, {
        is_tender: false,
      })
      if (contractTags.data) this.contractTags = [...contractTags.data]
      const tenderTags = await customFetch(this, getTags, { is_tender: true })
      if (tenderTags.data) this.tenderTags = [...tenderTags.data]
    },
    async getEquipVariations() {
      const res = await customFetch(this, getEquipVariations, {
        start: 0,
        length: 0,
      })
      if (res.data) this.equipVariations = [...res.data]
    },
    async createRole(role) {
      await customFetch(this, postRole, role)
      this.getRoles()
    },
    async editRole(role) {
      await customFetch(this, putRole, role, role.id)
      this.getRoles()
    },
    async deleteRole(id) {
      await customFetch(this, deleteRole, id)
      this.getRoles()
    },
    async createTag(tag) {
      await customFetch(this, postTag, tag)
      this.getTags()
    },
    async editTag(tag) {
      await customFetch(this, putTag, tag, tag.id)
      this.getTags()
    },
    async deleteTag(id) {
      await customFetch(this, deleteTag, id)
      this.getTags()
    },
    async createEquipVariation(variation) {
      await customFetch(this, postEquipVariation, variation)
      this.getEquipVariations()
    },
    async editEquipVariation(variation) {
      await customFetch(this, putEquipVariation, variation, variation.id)
      this.getEquipVariations()
    },
    async deleteEquipVariation(id) {
      await customFetch(this, deleteEquipVariation, id)
      this.getEquipVariations()
    },
  },
}
</script>

<style scoped></style>
