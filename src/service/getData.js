import axios from 'axios'
/**
 * 获取商铺详情
 */
export const shopDetails = shopId => axios.post('/shop/detail', {
  shopId
})
/**
 * 获取商铺商品列表
 */
export const getGoodsList = shopId => axios.post('/shop/goods', {
  shopId
})
/**
 * 获取商铺评价列表
 */
export const getRatingList = (shopId, offset, tagName = '') => axios.post('/shop/ratings', {
  shopId,
  offset,
  tagName
})
/**
 * 获取商品详情
 */
export const itemDetails = itemId => axios.post('/shop/item', {
  itemId
})
