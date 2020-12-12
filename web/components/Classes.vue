<template>
  <!-- <div>
    
      {{ p.courseName }}
    </div>
  </div> -->
  <!-- component -->
  <div>
    <div v-for="p in products" :key="p.id">
      <div class="max-w-md w-full lg:flex">
        <div
          class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden"
          style="background-image: url('https://tailwindcss.com/img/card-left.jpg')"
          title="Woman holding a mug"
        ></div>
        <div
          class="border-r border-b border-l border-grey-light lg:border-l-0 lg:border-t lg:border-grey-light bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal"
        >
          <div class="mb-8">
            <div class="text-black font-bold text-xl mb-2">
              {{ p.courseName }}
            </div>
            Price ₹{{ p.pricePerHour }} /Hour
            <p class="text-grey-darker text-base">
              Available Seats {{ p.seats }}
            </p>
          </div>
          <div class="flex items-center">
            <img
              class="w-10 h-10 rounded-full mr-4"
              src="https://pbs.twimg.com/profile_images/885868801232961537/b1F6H4KC_400x400.jpg"
              alt="Avatar of Jonathan Reinink"
            />
            <div class="text-sm">
              <p class="text-black leading-none">{{ p.postedBy }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
