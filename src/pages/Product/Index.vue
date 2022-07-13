<script setup>
import { provide, ref } from "vue";
import useApi from "@/composable/useApi";
import App from "@/components/Layout/App.vue";

const products = ref([]);
const expandIndex = ref(null)
const stockItems = ref([''])

provide('products', products)
provide('stockItems', stockItems)
provide('expandIndex', expandIndex)

useApi.get("/products").then(({ data }) => {
  products.value = data.data;
});

function expand(index) {
  if (expandIndex.value === index) {
    expandIndex.value = null
  } else {
    expandIndex.value = index
    useApi.get(`/products/${products.value[index].ID}/stocks`).then(({data}) => {
      stockItems.value = data.data
    })
  }
}

function deleteProduct(index) {
  if (! confirm('Delete?')) {
    return
  }

  useApi.delete(`/products/${products.value[index].ID}`).then(() => {
    products.value.splice(index, 1)
  })
}

function deleteStockItem(index) {
  if (! confirm('Delete?')) {
    return
  }
  useApi.delete(`/stocks/${stockItems.value[index].ID}`).then(() => {
    stockItems.value.splice(index, 1)
  })
}

function incrementOrDecrementStockQuantity(index, mode) {
  useApi.patch(`/stocks/${stockItems.value[index].ID}/quantity/${mode}`).then(() => {
    switch (mode) {
      case 'increment':
        stockItems.value[index].comment_count = typeof stockItems.value[index].comment_count === 'string' ? parseInt(stockItems.value[index].comment_count) + 1 : stockItems.value[index].comment_count + 1;
      break;
      case 'decrement':
        stockItems.value[index].comment_count = typeof stockItems.value[index].comment_count === 'string' ? parseInt(stockItems.value[index].comment_count) - 1 : stockItems.value[index].comment_count - 1;
        break;
    }
  })
}

</script>

<template>
  <App>
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
      <div class="mt-3">
        <router-link
          v-if="$route.name === 'product.index'"
          class="inline-block px-4 py-2 text-white rounded bg-indigo-500"
          :to="{ name: 'product.create' }"
        >Create New
        </router-link
        >
        <router-view></router-view>
      </div>
      <div class="relative rounded-xl overflow-auto">
        <div class="shadow-sm overflow-hidden my-8">
          <table class="border-collapse table-fixed w-full text-sm">
            <thead>
            <tr>
              <th
                class="border-b dark:border-slate-600 font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
              >
                ID
              </th>
              <th
                class="border-b dark:border-slate-600 font-medium p-4 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
              >
                Barcode
              </th>
              <th
                class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"
              >
                Name
              </th>
              <th class="border-b dark:border-slate-600 font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 dark:text-slate-200 text-left"></th>
            </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800">
            <template v-for="(product, index) in products">
              <tr>
                <td
                  class="border-b border-slate-200 dark:border-slate-600 p-4 pl-8 text-slate-500 dark:text-slate-400"
                >
                  {{ product.ID }}
                </td>
                <td
                  class="border-b border-slate-200 dark:border-slate-600 p-4 text-slate-500 dark:text-slate-400"
                >
                  {{ product.barcode }}
                </td>
                <td
                  class="border-b border-slate-200 dark:border-slate-600 p-4 pr-8 text-slate-500 dark:text-slate-400"
                >
                  {{ product.post_title }}
                </td>
                <td class="border-b border-slate-200 dark:border-slate-600 p-4 pr-8 text-slate-500 dark:text-slate-400 text-right">
                  <button @click="expand(index)" class="bg-indigo-500 text-white py-1 px-3 rounded text-xs" v-text="expandIndex === index ? 'Collapse' : 'Expand'"></button>
                  <button @click="deleteProduct(index)" class="bg-red-500 text-white py-1 px-3 rounded text-xs ml-3">Delete</button>
                </td>
              </tr>
              <tr v-if="index === expandIndex">
                <td colspan="4">
                  <table class="w-full">
                    <thead>
                      <tr class="[&>th]:text-gray-500 [&>th]:p-2">
                        <th>Manufacture Date</th>
                        <th>Expire Date</th>
                        <th>Quantity</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, stockIndex) in stockItems" class="[&>td]:p-2 [&>td]:text-center">
                      <td>{{ item.post_date }}</td>
                      <td>{{ item.post_modified }}</td>
                      <td>
                        <button @click="incrementOrDecrementStockQuantity(stockIndex, 'decrement')" class="bg-sky-500 text-white py-1 px-3 rounded text-xs mr-3">-</button>
                        {{ item.comment_count }}
                        <button @click="incrementOrDecrementStockQuantity(stockIndex, 'increment')" class="bg-emerald-500 text-white py-1 px-3 rounded text-xs ml-3">+</button>
                      </td>
                      <td>
                        <button @click="deleteStockItem(stockIndex)" class="bg-red-500 text-white py-1 px-3 rounded text-xs ml-3">Delete</button>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </App>
</template>
