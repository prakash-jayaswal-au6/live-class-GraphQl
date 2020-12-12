<template>
  <!-- <div>
    <div v-for="p in products" :key="p.id">
      {{ p.courseName }}
    </div>
  </div> -->
  <!-- component -->
  <!-- animation -->
  <section
    class="p-10 min-h-screen flex md:flex-row items-center justify-around bg-blue-500 flex-wrap sm:flex-col"
  >
    <!-- scale -->
    <div v-for="p in products" :key="p.id">
      <div class="h-32 w-32 relative cursor-pointer mb-5">
        <div
          class="absolute inset-0 bg-white opacity-25 rounded-lg shadow-2xl"
        ></div>
        <div
          class="absolute inset-0 transform  hover:scale-75 transition duration-300"
        >
          <div class="h-full w-full bg-white rounded-lg shadow-2xl">
            {{ p.courseName }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ALL_PRODUCTS from '~/../gql/classes/getProducts.gql'

export default {
  data() {
    return {
      products: null,
      amount: null
    }
  },
  async created() {
    await this.getProducts()
  },
  methods: {
    async getProducts() {
      try {
        const products = await this.$apollo.query({
          query: ALL_PRODUCTS,
          fetchPolicy: 'no-cache'
        })
        console.log(products.data.products)
        this.products = products.data.products
      } catch (e) {
      } finally {
      }
    }
  }
}
</script>

<style></style>
