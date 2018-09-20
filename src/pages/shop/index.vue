<template>
  <div class="container">
    <div :class="{ out: outContainer }">
      <header>
        <div class="cover-img" :style="{ backgroundImage: 'url(' + imgBaseUrl + shopDetailData.cover + ')' }"></div>
        <div class="shop-info">
          <div class="summary">
            <div class="left"><img :src="imgBaseUrl + shopDetailData.cover"/></div>
            <div class="right">
              <div class="title">
                <span class="ico"></span>
                <span class="ellipsis">{{ shopDetailData.name }}</span>
              </div>
              <div class="delivery">{{ shopDetailData.deliveryMethod }} / {{ shopDetailData.deliveryTime }}分钟送达</div>
              <div class="support" v-if="shopDetailData.supports" @click="showActivity">
                <div class="detail">
                  <span class="ico" :class="supportType[shopDetailData.supports[0].type]"></span>
                  <span class="ellipsis">{{ shopDetailData.supports[0].description }}</span>
                </div>
                <div class="arrow">
                  <span>{{ shopDetailData.supports.length }}个</span>
                  <span class="icon-arrow_right"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bulletin" @click="showActivity">
          <div class="detail">
            <span class="ico"></span>
            <span class="description ellipsis">{{ shopDetailData.bulletin }}</span>
            <span class="icon-arrow_right"></span>
          </div>
        </div>
      </header>
      <section class="tab">
        <div :class="{ on: 0 === tabIndex }" @click="changeTab(0)">商品</div>
        <div :class="{ on: 1 === tabIndex }" @click="changeTab(1)">评价</div>
        <div :class="{ on: 2 === tabIndex }" @click="changeTab(2)">商家</div>
      </section>
      <section class="swiper">
        <div v-show="0 === tabIndex">
          <div class="shop-goods">
            <div class="category">
              <div v-for="(item, index) in shopGoodsList" :key="index" :class="{ on: index === categoryIndex }" @click="chooseCategory(index)">
                <span class="ico" :class="categoryType[item.type]" v-if="item.type >= 0"></span>
                <span>{{ item.name }}</span>
                <span class="text-num" v-if="cartCategoryNum[index]">{{ cartCategoryNum[index] }}</span>
              </div>
            </div>
            <div class="goods-list">
              <div class="goods" v-for="(item, index) in shopGoodsList" :key="index" :class="{ on: index === categoryIndex }" @click="viewItem(item.id, $event)">
                <div class="title">{{ item.name }}</div>
                <div class="item" v-for="(goodsItem, goodsIndex) in item.goods" :key="goodsIndex">
                  <div class="left"><img :src="goodsItem.icon"/></div>
                  <div class="right">
                    <div class="name ellipsis">{{ goodsItem.name }}</div>
                    <div class="description ellipsis" v-if="goodsItem.description">{{ goodsItem.description }}</div>
                    <div class="detail">
                      <span>月售{{ goodsItem.sellCount }}份</span>
                      <span>好评率{{ goodsItem.rating }}%</span>
                    </div>
                    <div class="price">
                      <span>{{ goodsItem.price }}</span>
                      <del v-if="goodsItem.oldPrice">{{ goodsItem.oldPrice }}</del>
                    </div>
                    <div class="buttons">
                      <a href="javascript:;" class="icon-remove_circle" role="button" v-if="cartItemNum[goodsItem.id]" @click="delCartItem(goodsItem.id)"></a>
                      <span role="button" v-if="cartItemNum[goodsItem.id]">{{ cartItemNum[goodsItem.id] }}</span>
                      <a href="javascript:;" class="icon-add_circle" role="button" @click="addCartItem(goodsItem)"></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-mask" v-show="showCart" @click="hideCart">
            <div class="cart-view">
              <div class="title">
                <span>购物车</span>
                <a href="javascript:;" class="remove" @click="clearCart">清空</a>
              </div>
              <div class="list">
                <div class="item" v-for="(item, index) in cartItemList" :key="index">
                  <div class="name ellipsis">{{ item.name }}</div>
                  <div class="price">{{ item.price }}</div>
                  <div class="buttons">
                    <a href="javascript:;" class="icon-remove_circle" role="button" @click="delCartItem(item.id)"></a>
                    <span role="button">{{ item.num }}</span>
                    <a href="javascript:;" class="icon-add_circle" role="button" @click="addCartItem(item)"></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-footer" @click="switchCart">
            <div class="balance" :class="{ on: showCart || cartItemList.length }">
              <div class="shopping-cart">
                <span class="icon-shopping_cart"></span>
                <span class="text-num" v-show="totalNum">{{ totalNum }}</span>
              </div>
              <div class="shopping-price">
                <span class="price">¥{{ balancePrice }}</span>
                <span class="delivery">另需配送费¥{{ shopDetailData.deliveryPrice }}元</span>
              </div>
            </div>
            <a href="javascript:;" class="checkout" :class="{ on: balancePrice >= shopDetailData.minPrice }">
              <span v-if="!balancePrice">¥{{ shopDetailData.minPrice }}起送</span>
              <span v-else-if="balancePrice < shopDetailData.minPrice">还差¥{{ shopDetailData.minPrice - balancePrice }}起送</span>
              <span role="button" v-else>去结算</span>
            </a>
          </div>
        </div>
        <div v-show="1 === tabIndex">
          <div class="review-summary">
            <div class="left">
              <span class="score">{{ shopDetailData.score }}</span>
              <span class="title">综合评分</span>
              <span>高于周边商家{{ shopDetailData.rankRate }}%</span>
            </div>
            <div class="right">
              <div>
                <div class="title">服务态度</div>
                <div class="grade">
                  <span v-for="(rateItem, rateIndex) in gradeClasses(shopDetailData.serviceScore)" :class="rateItem" :key="rateIndex"></span>
                </div>
                <div class="score">{{ shopDetailData.serviceScore }}</div>
              </div>
              <div>
                <div class="title">菜品评价</div>
                <div class="grade">
                  <span v-for="(rateItem, rateIndex) in gradeClasses(shopDetailData.goodsScore)" :class="rateItem" :key="rateIndex"></span>
                </div>
                <div class="score">{{ shopDetailData.goodsScore }}</div>
              </div>
              <div>
                <div class="title">送达时间</div>
                <div>{{ shopDetailData.deliveryTime }}分钟</div>
              </div>
            </div>
          </div>
          <div class="review-detail">
            <div class="nav">
              <div :class="{ on: item.type === reviewType, not: item.type === 1 }" v-for="(item, index) in shopReviewInfo" :key="index" @click="switchReview(item.type)">
                <span>{{ item.name }}</span>
                <span class="cnt">{{ item.count}}</span>
              </div>
            </div>
            <div :class="['filter', { on: reviewFilter }]" @click="filterReview(reviewFilter)">
              <span class="icon-check_circle"></span>
              <span>只看有内容的评价</span>
            </div>
            <div class="list">
              <div class="item" v-for="(item, index) in shopReviewList" :key="index" v-if="(reviewType === -1 || item.rateType === reviewType) && (reviewFilter ? item.text : true)">
                <div class="left"><img :src="item.avatar"/></div>
                <div class="right">
                  <div class="title">
                    <span>{{ item.username }}</span>
                    <span class="date">{{ item.rateTime | formatDate }}</span>
                  </div>
                  <div class="rating">
                    <div class="grade">
                      <span v-for="(rateItem, rateIndex) in gradeClasses(item.score)" :class="rateItem" :key="rateIndex"></span>
                    </div>
                    <div class="delivery" v-if="item.deliveryTime">{{ item.deliveryTime }}分钟送达</div>
                  </div>
                  <div class="text" v-if="item.text">{{ item.text }}</div>
                  <div class="recommend" v-if="item.recommend.length">
                    <span class="icon-thumb_up"></span>
                    <span v-for="(recommendItem, recommendIndex) in item.recommend" :key="recommendIndex">{{ recommendItem }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="2 === tabIndex">
          <div class="shop-info">
            <div class="summary">
              <div class="left">
                <div class="title">
                  <span class="ellipsis">{{ shopDetailData.name }}</span>
                </div>
                <div class="description">
                  <div class="grade">
                    <span v-for="(rateItem, rateIndex) in gradeClasses(shopDetailData.score)" :class="rateItem" :key="rateIndex"></span>
                  </div>
                  <div class="detail">
                    <span>({{ shopDetailData.ratingCount }})</span>
                    <span>月售{{ shopDetailData.sellCount }}单</span>
                  </div>
                </div>
              </div>
              <div class="right">
                <div :class="{ on: isFavorite }" @click="doFavorite(isFavorite)">
                  <a href="javascript:;" class="icon-favorite"></a>
                  <span>{{ isFavorite ? '已收藏' : '收藏'}}</span>
                </div>
              </div>
            </div>
            <div class="delivery">
              <div>
                <span>起送价</span>
                <span>{{ shopDetailData.minPrice }}</span>
              </div>
              <div>
                <span>商家配送</span>
                <span>{{ shopDetailData.deliveryPrice }}</span>
              </div>
              <div>
                <span>平均配送时间</span>
                <span>{{ shopDetailData.deliveryTime }}</span>
              </div>
            </div>
          </div>
          <div class="shop-activity">
            <div class="title">公告与活动</div>
            <div class="bulletin">{{ shopDetailData.bulletin }}</div>
            <div class="description" v-for="(item, index) in shopDetailData.supports" :key="index">
              <span class="ico" :class="supportType[item.type]"></span>
              <span class="ellipsis">{{ item.description }}</span>
            </div>
          </div>
          <div class="shop-album">
            <div class="title">商家实景</div>
            <div class="description">
              <img v-for="(item, index) in shopDetailData.pics" :key="index" :src="item"/>
            </div>
          </div>
          <div class="shop-detail">
            <div class="title">商家信息</div>
            <div class="description" v-for="(item, index) in shopDetailData.info" :key="index">{{ item }}</div>
          </div>
        </div>
      </section>
    </div>
    <div class="activity-sheet" v-if="showActivitySheet">
      <div class="detail">
        <div class="title">{{ shopDetailData.name }}</div>
        <div class="grade">
          <span v-for="(item, index) in gradeClasses(shopDetailData.score)" :class="item" :key="index"></span>
        </div>
        <div class="support">
          <div class="title">优惠信息</div>
          <div class="description" v-for="(item, index) in shopDetailData.supports" :key="index">
            <span class="ico" :class="supportType[item.type]"></span>
            <span class="ellipsis">{{ item.description }}</span>
          </div>
        </div>
        <div class="info">
          <div class="title">商家公告</div>
          <div class="description" v-for="(item, index) in shopDetailData.info" :key="index">{{ item }}</div>
        </div>
      </div>
      <div class="close" @click="hideActivity">
        <a href="javascript:;" class="icon-close"></a>
      </div>
    </div>
  </div>
</template>

<script>
import {imgBaseUrl} from '@/utils/config'
import {formatDate} from '@/utils/date'
import {shopDetails, getGoodsList, getRatingList} from '@/service/getData'
export default {
  data () {
    return {
      shopId: null, // 商户Id
      showLoading: true, // 显示加载动画
      tabIndex: 0, // 切换tab
      cartCategoryNum: {},
      cartItemNum: {},
      cartItemList: [],
      shopDetailData: {}, // 商户详情
      shopGoodsList: [],
      shopReviewInfo: {},
      shopReviewList: [],
      categoryIndex: 0,
      isFavorite: false,
      reviewType: -1,
      reviewFilter: false,
      outContainer: false,
      showCart: false,
      showActivitySheet: false, // 是否显示活动信息
      supportType: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      categoryType: ['special'],
      imgBaseUrl
    }
  },
  created () {
    this.shopId = this.$route.query.id
    this.initCart()
  },
  mounted () {
    this.fetchData()
  },
  filters: {
    formatDate (value) {
      if (!value) return ''
      return formatDate(new Date(value), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  computed: {
    balancePrice () {
      let total = 0
      this.cartItemList.forEach(val => {
        if (val.num) {
          total += val.num * val.price
        }
      })
      return total
    },
    totalNum () {
      let num = 0
      this.cartItemList.forEach(item => {
        num += item.num
      })
      return num
    }
  },
  methods: {
    initCart () {
      let cartList = localStorage.getItem('cartList')
      if (cartList) {
        cartList = JSON.parse(cartList)
        this.cartItemList = cartList[this.shopId] || []
      }
    },
    initCategoryNum () {
      this.cartItemNum = []
      this.cartItemList.forEach(item => {
        this.cartItemNum[item.id] = item.num
      })
      this.cartCategoryNum = []
      this.shopGoodsList.forEach((item, index) => {
        item.goods.forEach(goodsItem => {
          if (this.cartItemNum[goodsItem.id]) {
            if (this.cartCategoryNum[index]) {
              this.cartCategoryNum[index] += this.cartItemNum[goodsItem.id]
            } else {
              this.cartCategoryNum[index] = this.cartItemNum[goodsItem.id]
            }
          }
        })
      })
    },
    async fetchData () {
      await shopDetails(this.shopId).then(res => {
        if (res.data.code === 'success') {
          this.shopDetailData = res.data.data
          this.isFavorite = res.data.data.isFavorite
        }
      })
      getGoodsList().then(res => {
        if (res.data.code === 'success') {
          this.shopGoodsList = res.data.data
          this.initCategoryNum()
        }
      })
      getRatingList().then(res => {
        if (res.data.code === 'success') {
          this.shopReviewInfo = res.data.data.info
          this.shopReviewList = res.data.data.list
        }
      })
    },
    changeTab (index) {
      this.tabIndex = index
    },
    viewItem (id, event) {
      if (event.target.getAttribute('role') !== 'button') {
        this.$router.push({path: '/shop/item', query: {id: id}})
      }
    },
    addCartItem (item) {
      let index = this.cartItemList.findIndex((value) => value.id === item.id)
      if (index > -1) {
        this.cartItemList[index].num++
      } else {
        this.cartItemList.push({
          'id': item.id,
          'name': item.name,
          'price': item.price,
          'num': 1
        })
      }
      this.initCategoryNum()
      let cartList = {}
      cartList[this.shopId] = this.cartItemList
      localStorage.setItem('cartList', JSON.stringify(cartList))
    },
    delCartItem (id) {
      let index = this.cartItemList.findIndex((value) => value.id === id)
      if (index > -1) {
        this.cartItemList[index].num--
        if (!this.cartItemList[index].num) {
          this.cartItemList.splice(index, 1)
        }
      }
      this.initCategoryNum()
      let cartList = {}
      cartList[this.shopId] = this.cartItemList
      localStorage.setItem('cartList', JSON.stringify(cartList))
    },
    clearCart () {
      this.cartItemList = []
      this.initCategoryNum()
      let cartList = {}
      cartList[this.shopId] = this.cartItemList
      localStorage.setItem('cartList', JSON.stringify(cartList))
    },
    hideCart (event) {
      if (event.target.className === 'cart-mask') {
        this.showCart = false
      }
    },
    switchCart () {
      if (event.target.getAttribute('role') !== 'button' && this.cartItemList.length) {
        this.showCart = !this.showCart
      }
    },
    switchReview (index) {
      this.reviewType = index
    },
    filterReview (state) {
      this.reviewFilter = !state
    },
    showActivity () {
      this.showActivitySheet = true
      this.outContainer = true
    },
    hideActivity () {
      this.showActivitySheet = false
      this.outContainer = false
    },
    chooseCategory (index) {
      this.categoryIndex = index
    },
    gradeClasses (score) {
      score = Math.floor(score * 2) / 2
      let result = []
      let hasDecimal = score % 1 !== 0
      let integer = Math.floor(score)
      for (let i = 0; i < integer; i++) {
        result.push('on')
      }
      if (hasDecimal) {
        result.push('half')
      }
      while (result.length < 5) {
        result.push('')
      }
      return result
    },
    doFavorite (state) {
      this.isFavorite = !state
    }
  },
  watch: {
    cartItemList (value) {
      if (!value.length) {
        this.showCart = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .out {
    filter: blur(10px);
  }
  header {
    position: relative;
    overflow: hidden;
    .cover-img {
      position: absolute;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      filter: blur(10px);
      z-index: 9;
    }
    .shop-info {
      position: relative;
      padding: pxToRem(48px) pxToRem(24px) pxToRem(36px) pxToRem(48px);
      background-color: rgba(7, 17, 27, 0.5);
      z-index: 10;
      .summary {
        @include box;
        align-items: center;
        .left {
          height: pxToRem(128px);
          margin-right: pxToRem(32px);
          img {
            width: pxToRem(128px);
            @include borderRadius(pxToRem(4px));
          }
        }
        .right {
          @include flex(1);
          padding: pxToRem(4px) 0;
          font-weight: 200;
          line-height: 1;
          color: #fff;
          .title {
            @include box;
            align-items: center;
            span {
              display: inline-block;
              font-size: pxToRem(32px);
              font-weight: bold;
              line-height: pxToRem(36px);
              &.ico {
                width: pxToRem(60px);
                height: pxToRem(36px);
                margin-right: pxToRem(12px);
                @include backImage('../../images/brand');
              }
            }
          }
          .delivery {
            padding-top: pxToRem(16px);
            font-size: pxToRem(24px);
          }
          .support {
            @include box;
            justify-content: space-between;
            align-items: center;
            padding-top: pxToRem(10px);
            font-size: pxToRem(20px);
            line-height: pxToRem(24px);
            .detail {
              @include box;
              span {
                display: inline-block;
              }
            }
            .arrow {
              @include box;
              align-items: center;
              padding: pxToRem(14px) pxToRem(16px);
              background-color: rgba(0, 0, 0, 0.2);
              font-size: pxToRem(20px);
              font-weight: 200;
              color: rgb(255, 255, 255);
              @include borderRadius(pxToRem(24px));
            }
          }
        }
      }
    }
    .bulletin {
      position: relative;
      height: pxToRem(56px);
      overflow: hidden;
      padding: 0 pxToRem(24px);
      background-color: rgba(7, 17, 27, 0.2);
      z-index: 10;
      .detail {
        @include box;
        align-items: center;
        height: 100%;
        span {
          display: inline-block;
          font-size: pxToRem(20px);
          color: #fff;
          font-weight: 200;
          line-height: pxToRem(56px);
          &.ico {
            width: pxToRem(44px);
            height: pxToRem(24px);
            @include backImage('../../images/bulletin');
          }
          &.description {
            width: 90%;
            height: 100%;
            padding: 0 pxToRem(8px);
          }
        }
      }
    }
  }
  .support {
    .ico {
      width: pxToRem(24px);
      height: pxToRem(24px);
      margin-right: pxToRem(8px);
      &.decrease {
        @include backImage('../../images/decrease_1');
      }
      &.discount {
        @include backImage('../../images/discount_1');
      }
      &.special {
        @include backImage('../../images/special_1');
      }
      &.invoice {
        @include backImage('../../images/invoice_1');
      }
      &.guarantee {
        @include backImage('../../images/guarantee_1');
      }
    }
  }
  .tab {
    @include box;
    height: pxToRem(80px);
    background-color: #fff;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    justify-content: space-between;
    align-items: center;
    div {
      @include flex(1);
      line-height: 1;
      font-size: pxToRem(28px);
      color: #4d555d;
      text-align: center;
      &.on {
        color: #f01414;
      }
    }
  }
  .swiper {
    & > div {
      @include box;
      flex-direction: column;
      width: 100%;
      background-color: #f3f5f7;
      .grade {
        text-align: center;
        span {
          display: inline-block;
          width: pxToRem(36px);
          height: pxToRem(36px);
          margin-right: pxToRem(3px);
          @include backImage('../../images/star36_off');
          &.on {
            @include backImage('../../images/star36_on');
          }
          &.half {
            @include backImage('../../images/star36_half');
          }
        }
      }
      .shop-goods {
        @include box;
        padding-bottom: pxToRem(96px);
        .category {
          font-size: pxToRem(24px);
          line-height: pxToRem(28px);
          color: #07111b;
          div {
            position: relative;
            width: pxToRem(160px);
            padding: pxToRem(40px) pxToRem(24px);
            &.on {
              background-color: #fff;
              font-weight: 200;
            }
            .ico {
              display: inline-block;
              width: pxToRem(24px);
              height: pxToRem(24px);
              vertical-align: text-bottom;
              &.special {
                @include backImage('../../images/special_3');
              }
            }
            .text-num {
              position: absolute;
              top: pxToRem(20px);
              right: pxToRem(10px);
              width: pxToRem(32px);
              height: pxToRem(32px);
              background-color: #f01414;
              font-size: pxToRem(16px);
              font-weight: 700;
              line-height: 2;
              text-align: center;
              color: #fff;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
              @include borderRadius(50%);
            }
          }
        }
        .goods-list {
          @include flex(1);
          background-color: #fff;
          color: #93999f;
        }
        .goods {
          display: none;
          &.on {
            display: block;
          }
          .title {
            padding-left: pxToRem(28px);
            background-color: #f3f5f7;
            color: rgb(147,153,159);
            font-size: pxToRem(24px);
            line-height: pxToRem(52px);
            border-left: 4px solid #d9dde1;
          }
          .item {
            @include box;
            padding: pxToRem(36px);
            .left {
              img {
                height: pxToRem(114px);
                width: pxToRem(114px);
                @include borderRadius(pxToRem(4px));
              }
            }
            .right {
              @include flex(1);
              position: relative;
              padding: pxToRem(4px) 0 0 pxToRem(20px);
              font-size: pxToRem(20px);
              color: #93999f;
              line-height: 1;
              .name {
                width: pxToRem(300px);
                font-size: pxToRem(28px);
                color: #07111b;
              }
              .description, .detail {
                width: pxToRem(300px);
                padding-top: pxToRem(16px);
              }
              .detail span {
                margin-right: pxToRem(24px);
              }
              .price {
                font-size: pxToRem(28px);
                font-weight: 700;
                line-height: pxToRem(48px);
                color: #f01414;
                :before {
                  content: "¥";
                  font-size: pxToRem(20px);
                  font-weight: normal;
                }
                del {
                  margin-left: pxToRem(16px);
                  font-weight: normal;
                  color: #93999f;
                }
              }
              .buttons {
                display: inline-flex;
                align-items: center;
                position: absolute;
                right: 0;
                bottom: 0;
                span {
                  width: pxToRem(48px);
                  text-align: center;
                  font-size: pxToRem(20px);
                  line-height: pxToRem(48px);
                  color: #93999f;
                }
                a {
                  font-size: pxToRem(48px);
                  line-height: pxToRem(48px);
                  color: #00a0dc;
                }
              }
            }
          }
        }
      }
      .cart-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, 0.8);
        z-index: 20;
      }
      .cart-view {
        position: fixed;
        left: 0;
        bottom: pxToRem(96px);
        width: 100%;
        background-color: #fff;
        z-index: 22;
        .title {
          @include box;
          align-items: center;
          justify-content: space-between;
          padding: 0 pxToRem(36px);
          background-color: #f3f5f7;
          font-size: pxToRem(28px);
          line-height: pxToRem(80px);
          color: #07111b;
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          .remove {
            font-size: pxToRem(24px);
            color: #00a0dc;
          }
        }
        .list {
          padding: 0 pxToRem(36px);
          font-size: pxToRem(28px);
          line-height: pxToRem(48px);
          color: #07111b;
          .item {
            @include box;
            justify-content: space-between;
            padding: pxToRem(24px) 0;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            .name {
              @include flex(1);
            }
            .price {
              margin-left: pxToRem(36px);
              font-weight: 700;
              color: #f01414;
              &:before {
                content: "¥";
                font-size: pxToRem(20px);
                font-weight: normal;
              }
            }
            .buttons {
              display: inline-flex;
              align-items: center;
              margin-left: pxToRem(24px);
              span {
                width: pxToRem(48px);
                text-align: center;
                font-size: pxToRem(20px);
                color: #93999f;
              }
              a {
                font-size: pxToRem(48px);
                color: #00a0dc;
              }
            }
          }
        }
      }
      .cart-footer {
        @include box;
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        height: pxToRem(96px);
        align-items: center;
        background-color: rgba(20, 29, 39, 0.95);
        z-index: 21;
        .balance {
          @include box;
          @include flex(1);
          align-items: center;
          position: relative;
          padding: pxToRem(24px) pxToRem(24px) pxToRem(24px) pxToRem(36px);
          &.on {
            .shopping-cart span.icon-shopping_cart {
              background-color: #00a0dc;
              color: #fff;
            }
            .shopping-price span.price {
              color: #fff;
            }
          }
          .shopping-cart {
            position: absolute;
            top: pxToRem(-20px);
            padding: pxToRem(12px);
            background-color: rgba(20, 29, 39, 0.95);
            text-align: center;
            @include borderRadius(50%);
            span.icon-shopping_cart {
              @include box;
              align-items: center;
              justify-content: center;
              width: pxToRem(88px);
              height: pxToRem(88px);
              background-color: rgba(255, 255, 255, 0.1);
              font-size: pxToRem(40px);
              line-height: pxToRem(48px);
              color: rgba(255, 255, 255, 0.4);
              @include borderRadius(50%);
            }
            span.text-num {
              position: absolute;
              top: 0;
              right: pxToRem(-12px);
              width: pxToRem(48px);
              padding: 0 pxToRem(12px);
              background-color: #f01414;
              font-size: pxToRem(18px);
              font-weight: 700;
              line-height: pxToRem(32px);
              color: #fff;
              box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
              @include borderRadius(12px);
            }
          }
          .shopping-price {
            @include box;
            align-items: center;
            height: pxToRem(48px);
            padding-left: pxToRem(160px);
            .price {
              display: inline-block;
              font-size: pxToRem(32px);
              color: rgba(255, 255, 255, 0.4);
              font-weight: 700;
              line-height: pxToRem(48px);
              &:after {
                content: "|";
                width: pxToRem(1px);
                padding: 0 pxToRem(24px);
                color: rgba(255, 255, 255, 0.1);
              }
            }
            .delivery {
              display: inline-block;
              font-size: pxToRem(20px);
              line-height: pxToRem(48px);
              color: rgba(255, 255, 255, 0.4);
            }
          }
        }
        .checkout {
          width: pxToRem(210px);
          height: 100%;
          background-color: #2b333b;
          text-align: center;
          font-size: pxToRem(24px);
          font-weight: 700;
          line-height: pxToRem(96px);
          color: rgba(255, 255, 255, 0.4);
          &.on {
            background-color: #00b43c;
            color: #fff;
          }
        }
      }
      .review-summary {
        @include box;
        align-items: center;
        margin-bottom: pxToRem(36px);
        padding: pxToRem(36px) 0;
        background-color: #fff;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .left {
          @include box;
          flex-direction: column;
          padding: 0 pxToRem(40px);
          text-align: center;
          font-size: pxToRem(20px);
          line-height: 1;
          color: #93999f;
          .score {
            margin-bottom: pxToRem(12px);
            font-size: pxToRem(48px);
            line-height: pxToRem(56px);
            color: #ff9900;
          }
          .title {
            margin-bottom: pxToRem(16px);
            font-size: pxToRem(24px);
            color: #07111b;
          }
        }
        .right {
          @include flex(1);
          padding: 0 pxToRem(48px);
          border-left: 1px solid rgba(7, 17, 27, 0.1);
          div {
            @include box;
            align-items: center;
            margin: pxToRem(8px) 0;
            font-size: pxToRem(24px);
            line-height: pxToRem(36px);
            color: #93999f;
            .title {
              margin-right: pxToRem(10px);
              color: #07111b;
            }
            .score {
              margin-left: pxToRem(10px);
              color: #ff9900;
            }
          }
        }
      }
      .review-detail {
        background-color: #fff;
        padding: 0 pxToRem(36px);
        .nav {
          @include box;
          margin: pxToRem(36px) 0 0;
          padding-bottom: pxToRem(36px);
          border-bottom: 1px solid rgba(7, 17, 27, 0.1);
          div {
            @include box;
            align-items: center;
            justify-content: center;
            width: pxToRem(120px);
            height: pxToRem(64px);
            margin-right: pxToRem(18px);
            background-color: rgba(0, 160, 220, 0.2);
            font-size: pxToRem(24px);
            line-height: pxToRem(32px);
            color: #4d555d;
            @include borderRadius(2px);
            &.not {
              background-color: rgba(147, 153, 159, 0.2);
            }
            &.on {
              background-color: #00a0dc;
              color: #fff;
            }
            &.not.on {
              background-color: #93999f;
            }
            .cnt {
              font-size: pxToRem(20px);
            }
          }
        }
        .filter {
          @include box;
          align-items: center;
          padding: pxToRem(30px) 0;
          font-size: pxToRem(24px);
          line-height: pxToRem(40px);
          color: #93999f;
          span:first-of-type {
            font-size: pxToRem(40px);
            color: #b7bbbf;
          }
          &.on {
            span:first-of-type {
              color: #00c850;
            }
          }
        }
        .list {
          .item {
            @include box;
            padding: pxToRem(36px) 0;
            border-top: 1px solid rgba(7, 17, 27, 0.1);
            .left {
              width: pxToRem(56px);
              margin-right: pxToRem(24px);
              img {
                width: pxToRem(56px);
                height: pxToRem(56px);
                @include borderRadius(50%);
              }
            }
            .right {
              @include flex(1);
              @include box;
              flex-direction: column;
              font-size: pxToRem(20px);
              line-height: pxToRem(24px);
              color: #07111b;
              .title {
                @include box;
                justify-content: space-between;
                .date {
                  color: #93999f
                }
              }
              .rating {
                @include box;
                align-items: center;
                margin-top: pxToRem(8px);
                .grade {
                  text-align: center;
                  span {
                    display: inline-block;
                    width: pxToRem(24px);
                    height: pxToRem(24px);
                    margin-right: pxToRem(3px);
                    @include backImage('../../images/star24_off');
                    &.on {
                      @include backImage('../../images/star24_on');
                    }
                    &.half {
                      @include backImage('../../images/star24_half');
                    }
                  }
                }
                .delivery {
                  margin-left: pxToRem(6px);
                  color: #93999f;
                }
              }
              .text {
                margin-top: pxToRem(12px);
                font-size: pxToRem(24px);
                line-height: pxToRem(36px);
              }
              .recommend {
                @include box;
                flex-wrap: wrap;
                align-items: center;
                font-size: pxToRem(24px);
                line-height: pxToRem(32px);
                span {
                  display: inline-block;
                  margin-top: pxToRem(12px);
                  margin-right: pxToRem(16px);
                  padding: pxToRem(4px) pxToRem(12px);
                  font-size: pxToRem(18px);
                  color: #93999f;
                  border: 1px solid rgba(7, 17, 27, 0.1);
                  @include borderRadius(2px);
                  &:first-of-type {
                    padding: 0;
                    color: #00a0dc;
                    border: none;
                  }
                }
              }
            }
          }
        }
      }
      .shop-info {
        margin-bottom: pxToRem(36px);
        padding: pxToRem(36px);
        background-color: #fff;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .summary {
          @include box;
          padding-bottom: pxToRem(36px);
          .left {
            @include flex(1);
            .title {
              font-size: pxToRem(28px);
              line-height: 1;
              color: #07111b;
            }
            .description {
              @include box;
              align-items: center;
              padding-top: pxToRem(16px);
              .detail {
                font-size: pxToRem(20px);
                line-height: pxToRem(36px);
                color: #4d555d;
                span {
                  margin-left: pxToRem(16px);
                }
              }
            }
          }
          .right {
            width: pxToRem(80px);
            margin-left: pxToRem(32px);
            div {
              @include box;
              flex-direction: column;
              align-items: center;
              font-size: pxToRem(20px);
              line-height: 1;
              color: #4d555d;
              &.on a {
                color: #f01414;
              }
              a {
                margin-bottom: pxToRem(8px);
                font-size: pxToRem(48px);
                color: rgba(147, 153, 159, 0.4);
              }
            }
          }
        }
        .delivery {
          @include box;
          justify-content: space-around;
          padding-top: pxToRem(36px);
          border-top: 1px solid rgba(7, 17, 27, 0.1);
          div {
            padding: 0 pxToRem(60px);
            border-left: 1px solid rgba(7, 17, 27, 0.1);
            &:first-of-type {
              border-left: none;
            }
            span {
              display: block;
              text-align: center;
              font-size: pxToRem(20px);
              line-height: 1;
              color: #93999f;
              &:last-child {
                margin-top: pxToRem(8px);
                font-size: pxToRem(48px);
                color: #07111b;
              }
            }
          }
        }
      }
      .shop-activity {
        margin-bottom: pxToRem(36px);
        padding: pxToRem(36px) pxToRem(36px) 0;
        background-color: #fff;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title {
          font-size: pxToRem(28px);
          line-height: 1;
          color: #07111b;
        }
        .bulletin {
          padding: pxToRem(16px) pxToRem(24px) pxToRem(32px);
          font-size: pxToRem(24px);
          line-height: 2;
          color: #f01414;
        }
        .description {
          @include box;
          align-items: center;
          padding: pxToRem(32px) pxToRem(24px);
          font-size: pxToRem(24px);
          line-height: pxToRem(32px);
          color: #07111b;
          border-top: 1px solid rgba(7, 17, 27, 0.1);
          span {
            display: inline-block;
            &.ico {
              width: pxToRem(32px);
              height: pxToRem(32px);
              margin-right: pxToRem(12px);
              &.decrease {
                @include backImage('../../images/decrease_4');
              }
              &.discount {
                @include backImage('../../images/discount_4');
              }
              &.special {
                @include backImage('../../images/special_4');
              }
              &.invoice {
                @include backImage('../../images/invoice_4');
              }
              &.guarantee {
                @include backImage('../../images/guarantee_4');
              }
            }
          }
        }
      }
      .shop-album {
        margin-bottom: pxToRem(36px);
        padding: pxToRem(36px);
        background-color: #fff;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title {
          margin-bottom: pxToRem(24px);
          font-size: pxToRem(28px);
          line-height: 1;
          color: #07111b;
        }
        .description {
          @include box;
          width: 100%;
          height: pxToRem(180px);
          overflow-x: scroll;
          overflow-y: hidden;
          img {
            width: pxToRem(240px);
            height: pxToRem(180px);
            margin-left: pxToRem(12px);
          }
        }
      }
      .shop-detail {
        padding: pxToRem(36px) pxToRem(36px) 0;
        background-color: #fff;
        .title {
          margin-bottom: pxToRem(24px);
          font-size: pxToRem(28px);
          line-height: 1;
          color: #07111b;
        }
        .description {
          @include box;
          align-items: center;
          padding: pxToRem(32px) pxToRem(24px);
          font-size: pxToRem(24px);
          line-height: pxToRem(32px);
          color: #07111b;
          border-top: 1px solid rgba(7, 17, 27, 0.1);
        }
      }
    }
  }
  .activity-sheet {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(7, 17, 27, 0.8);
    z-index: 99;
    .detail {
      padding: pxToRem(128px) pxToRem(72px) 0;
      .title {
        font-size: pxToRem(32px);
        font-weight: 700;
        line-height: 1;
        text-align: center;
        color: #fff;
      }
      .grade {
        padding-top: pxToRem(32px);
        text-align: center;
        span {
          display: inline-block;
          width: pxToRem(48px);
          height: pxToRem(48px);
          margin: 0 pxToRem(20px);
          @include backImage('../../images/star48_off');
          &.on {
            @include backImage('../../images/star48_on');
          }
          &.half {
            @include backImage('../../images/star48_half');
          }
        }
      }
      .support {
        padding-top: pxToRem(56px);
        line-height: 1;
        .title {
          margin-bottom: pxToRem(48px);
          line-height: 1px;
          border-left: pxToRem(224px) solid rgba(255, 255, 255, 0.2);
          border-right: pxToRem(224px) solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }
        .description {
          margin: pxToRem(24px);
          font-size: pxToRem(24px);
          color: #fff;
          span {
            display: inline-block;
          }
        }
      }
      .info {
        padding-top: pxToRem(56px);
        line-height: 1;
        .title {
          margin-bottom: pxToRem(48px);
          line-height: 1px;
          border-left: pxToRem(224px) solid rgba(255, 255, 255, 0.2);
          border-right: pxToRem(224px) solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }
        .description {
          margin: 0 pxToRem(24px);
          font-size: pxToRem(24px);
          line-height: 2;
          color: #fff;
        }
      }
    }
    .close {
      position: absolute;
      bottom: pxToRem(64px);
      width: 100%;
      text-align: center;
      a {
        font-size: pxToRem(64px);
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
</style>
