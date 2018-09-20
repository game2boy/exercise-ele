<template>
  <div class="container">
    <nav>
      <a href="javascript:;" class="icon-arrow_left" @click="back"></a>
    </nav>
    <div class="cover-img"><img :src="itemDetailData.image"/></div>
    <div class="summary">
      <div class="title">{{ itemDetailData.name }}</div>
      <div class="detail">
        <span>月售{{ itemDetailData.sellCount }}份</span>
        <span>好评率{{ itemDetailData.rating }}%</span>
      </div>
      <div class="price">
        <span>{{ itemDetailData.price }}</span>
        <del v-if="itemDetailData.oldPrice">{{ itemDetailData.oldPrice }}</del>
      </div>
      <div class="buttons">
        <a href="javascript:;" class="icon-remove_circle"></a>
        <span>1</span>
        <a href="javascript:;" class="icon-add_circle"></a>
      </div>
    </div>
    <div class="info">
      <div class="title">商品介绍</div>
      <div class="description">{{ itemDetailData.info }}</div>
    </div>
    <div class="review">
      <div class="title">商品评价</div>
      <div class="nav">
        <div :class="{ on: item.type === reviewType, not: item.type === 1 }" v-for="(item, index) in itemReviewInfo" :key="index" @click="switchReview(item.type)">
          <span>{{ item.name }}</span>
          <span class="cnt">{{ item.count}}</span>
        </div>
      </div>
      <div :class="['filter', { on: reviewFilter }]" @click="filterReview(reviewFilter)">
        <span class="icon-check_circle"></span>
        <span>只看有内容的评价</span>
      </div>
      <div class="list">
        <div class="item" v-for="(item, index) in itemReviewList" :key="index" v-if="(reviewType === -1 || item.rateType === reviewType) && (reviewFilter ? item.text : true)">
          <div class="title">
            <div class="left">{{ item.rateTime | formatDate }}</div>
            <div class="right">
              <span>{{ item.username }}</span>
              <img :src="item.avatar"/>
            </div>
          </div>
          <div class="rating">
            <span :class="{ 'icon-thumb_up on': !item.rateType, 'icon-thumb_down': item.rateType }"></span>
            <span v-if="item.text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDate} from '@/utils/date'
import {itemDetails} from '@/service/getData'
export default {
  data () {
    return {
      itemId: null,
      itemDetailData: {}, // 商品详情
      itemReviewInfo: {},
      itemReviewList: [],
      reviewType: -1,
      reviewFilter: false
    }
  },
  mounted () {
    this.fetchData()
  },
  filters: {
    formatDate: function (value) {
      if (!value) return ''
      return formatDate(new Date(value), 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    async fetchData () {
      await itemDetails(this.itemId).then(res => {
        if (res.data.code === 'success') {
          this.itemDetailData = res.data.data
          this.itemReviewInfo = res.data.data.ratings.info
          this.itemReviewList = res.data.data.ratings.list
        }
      })
    },
    back () {
      this.$router.go(-1)
    },
    switchReview (index) {
      this.reviewType = index
    },
    filterReview (state) {
      this.reviewFilter = !state
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../style/mixin';
  .container {
    position: relative;
    nav {
      position: absolute;
      top: pxToRem(20px);
      left: pxToRem(20px);
      a {
        font-size: pxToRem(24px);
        color: #fff;
      }
    }
  }
  .cover-img {
    height: pxToRem(750px);
    img {
      width: pxToRem(750px);
    }
  }
  .summary {
    position: relative;
    margin-bottom: pxToRem(36px);
    padding: pxToRem(36px);
    background-color: #fff;
    font-size: pxToRem(20px);
    color: #93999f;
    line-height: 1;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    .title {
      font-size: pxToRem(28px);
      font-weight: 700;
      color: #07111b;
    }
    .detail {
      margin-top: pxToRem(16px);
    }
    .detail span {
      margin-right: pxToRem(24px);
    }
    .price {
      margin-top: pxToRem(36px);
      font-size: pxToRem(28px);
      font-weight: 700;
      line-height: pxToRem(48px);
      color: #f01414;
      :before {
        content: "¥";
        font-size: pxToRem(20px);
      }
      del {
        margin-left: pxToRem(20px);
        font-weight: normal;
        color: #93999f;
      }
    }
    .buttons {
      display: inline-flex;
      align-items: center;
      position: absolute;
      right: pxToRem(36px);
      bottom: pxToRem(36px);
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
  .info {
    margin-bottom: pxToRem(36px);
    padding: pxToRem(36px);
    background-color: #fff;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    .title {
      font-size: pxToRem(28px);
      line-height: 1;
      color: #07111b;
    }
    .description {
      margin-top: pxToRem(12px);
      padding: 0 pxToRem(16px);
      font-size: pxToRem(24px);
      line-height: 2;
      color: #4d555d;
    }
  }
  .review {
    padding: pxToRem(36px);
    background-color: #fff;
    .title {
      font-size: pxToRem(28px);
      line-height: 1;
      color: #07111b;
    }
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
        padding: pxToRem(32px) 0;
        border-top: 1px solid rgba(7, 17, 27, 0.1);
        .title {
          @include box;
          justify-content: space-between;
          font-size: pxToRem(20px);
          line-height: pxToRem(24px);
          color: #93999f;
          .left {
            margin-right: pxToRem(24px);
          }
          .right {
            @include flex(1);
            @include box;
            justify-content: flex-end;
            img {
              width: pxToRem(24px);
              height: pxToRem(24px);
              margin-left: pxToRem(12px);
              @include borderRadius(50%);
            }
          }
        }
        .rating {
          @include box;
          align-items: center;
          margin-top: pxToRem(12px);
          font-size: pxToRem(24px);
          line-height: pxToRem(32px);
          color: #07111b;
          span:first-of-type {
            margin-right: pxToRem(8px);
            line-height: 2;
            color: #b7bbbf;
            &.on {
              color: #00a0dc;
            }
          }
        }
      }
    }
  }
</style>
