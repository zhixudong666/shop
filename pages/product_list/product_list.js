const util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 分类id
    id: null,
    // 当前页数
    currentPage: 1,
    // 总页数
    totalPage: null,
    // 产品
    products: null,
    // 筛选菜单是否显示
    filterBoxShow: false,
    // 综合的下拉菜单是否显示
    menuShow: false,
    // 产品的所有属性
    filterInfo: null,
    // 产品的所有价格区间
    filterPrice: null,
    // 用户选择的排序方式
    sortColumn: null,
    // 用户选择的产品属性筛选条件
    filterAttrs: {},
  },

  // 查询数据
  fetchData: function () {
    util.showLoading();
    wx.request({
      url: util.url + 'catalog/category/index',
      data: {
        categoryId: this.data.id,
        sortColumn: this.data.sortColumn,
        filterAttrs: this.data.filterAttrs
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          products: res.data.data.products,
          filterInfo: res.data.data.filter_info,
          currentPage: 1,
          totalPage: res.data.data.page_count
        })
      },
      fail: () => util.fail()
    })
  },

  // 清除筛选条件
  clearFilterAttrs: function () {
    this.setData({
      filterAttrs: {},
      filterBoxShow: false,
    });
    this.fetchData();
  },

  // 设置筛选条件 
  setFilterAttrs: function (e) {
    let k = e.currentTarget.dataset.key;
    let v = e.currentTarget.dataset.value;
    let o = this.data.filterAttrs;
    o[k] = v;
    this.setData({
      filterAttrs: o,
      filterBoxShow: false
    })
    this.fetchData();
  },
  
  // 设置FilterBox是否显示
  toggleFilterBox: function () {
    this.setData({
      filterBoxShow: !this.data.filterBoxShow,
    })
  },

  // 设置综合的下拉菜单是否显示
  toggleMenuShow: function () {
    this.setData({
      menuShow: !this.data.menuShow
    })
  },
 
  // 设置产品排序股则
  setSortColumn: function (e) {
    if (this.data.menuShow) {
      this.setData({
        menuShow: false
      })
    }
    if (!e.currentTarget.dataset.key) {
      this.setData({
        sortColumn: null
      })
    };
    this.setData({
      sortColumn: e.currentTarget.dataset.key
    })
    this.fetchData();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id || '57bea0e3f656f275313bf56e'
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.products) {
      this.fetchData();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    if (this.data.currentPage > this.data.totalPage) {
      return;
    }
    util.showLoading();
    wx.request({
      url: util.url + 'catalog/category/product',
      data: {
        p: this.data.currentPage,
        categoryId: this.data.id,
        sortColumn: this.data.sortColumn,
        filterAttrs: this.data.filterAttrs
      },
      success: res => {
        wx.hideLoading();
        let arr = this.data.products.concat(res.data.data.products);
        this.setData({
          products: arr
        })
      },
      fail: () => util.fail()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})