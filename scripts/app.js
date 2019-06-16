//算一算JS
var model=(function(){

  var item =function(id,name,value){
    this.id=id;
    this.name=name;
    this.value=value;
  };


  var data={
     allItems:[],
     totals:0,
  }
  var caculateTotal=function(){
    var sum=0;
    data.allItems.forEach(function(currentVal)
    {
      sum+=currentVal.value;
    });
    data.totals = sum;
  };
  return{
    addItem:function(name,value){
        var ID;
      if(data.allItems.length>0){
        ID=data.allItems[data.allItems.length-1].id +1;
      }else {
        ID=0;
      }

      var newItem=new item(ID,name,value);
      data.allItems.push(newItem);

      return newItem;
    },
    caculateSum:function(){
      caculateTotal();
      return{
        sum:data.totals,
      }
    },
    deleteItem:function(id)
    {
      var ids=data.allItems.map(function(currentVal){
        return currentVal.id;
      });
      var index= ids.indexOf(parseInt(id,10));
      //alert(index);
      if(index >=0){
          data.allItems.splice(index,1); //移除item
      }


    },
    test:function(){
      console.log(data);
    },
  }
})();


var view=(function(){
  var DomStrings   ={
    name:'.name',
    value:'.value',
    btn:'.bought_btn',
    list:'.bought_list',
    sumLabel:'.total_value',
    container:'.container',
    month:'.month',
  }
var  formatting=function(number){
  number=number.toFixed(2);
    number=number.replace(/(\d)(?=(\d{3})+\.)/g,'$1,'); //加千分號
  return number;
};
      return{
        getInfo:function(){
          return{
            name:document.querySelector(DomStrings.name).value,
            value:parseFloat(document.querySelector(DomStrings .value).value) ,
          };
        },
        addListItem:function(object){//將東西與金額加入到清單裡
            var newHtml;
            var element=DomStrings.list;
            var html='<div class="item clearfix" id="%id%"><div class="item_name">%name%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="delete"><button class="delete_btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            newHtml =html.replace('%id%',object.id);
            newHtml =newHtml.replace('%name%',object.name);
            newHtml =newHtml.replace('%value%',formatting(object.value)+'元' );
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);//新增bought_list裡的後面
        },
        cleanInput:function(){//清除買了什麼東西與金額
          var inputs=document.querySelectorAll(DomStrings.name + ',' + DomStrings.value);//取得多項元素使用querySelectorAll
          var inputArray= Array.prototype.slice.call(inputs);//將inputs轉成Array的方式，再用foreach將每筆資料的值清空
          inputArray.forEach(function(currentVal){
            currentVal.value='';
          })
          inputArray[0].focus();
        },
        displaySum:function(object){
          document.querySelector(DomStrings.sumLabel).textContent = formatting(object.sum) +'元';

        },
        dispalyMonth:function(){
          var now=new Date();
          var year= now.getFullYear();
          var month=now.getMonth()+1;
          document.querySelector(DomStrings.month).textContent = year +'年' + month +'月';

        },
        deleteListItem:function(id){

          var element=document.getElementById(id);
          element.parentNode.removeChild(element);

          console.log(element);
        },

        getDomStrings:function(){
          return DomStrings;
        },

      };
})();


var controller=(function(m,v){

  var setupEventListener=function(){
      var DomStrings=view.getDomStrings();
        document.querySelector(DomStrings.btn).addEventListener('click',addItem); //按下打勾執行ADDITEM
        document.addEventListener('keypress',function(event){
          if(event.keycode===13 || event.which===13)
          {
            addItem();
          }
        }
      ); //按下Enter鍵執行ADDITEM ,參考keycode.info
      document.querySelector(DomStrings.container).addEventListener('click',deleteItem);
  };

  var deleteItem = function(event){
    var itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;//取得class="item clearfix" 的ID
    console.log(itemID);
    model.deleteItem(itemID);
    view.deleteListItem(itemID);
    updateTotal();
  };
  var updateTotal =function(){
    var sum =  model.caculateSum();
    view.displaySum(sum);
  }

  var addItem=function(){
    var input=view.getInfo();
    //console.log(input);
    if(input.name !=='' && !isNaN(input.value) && input.value > 0 ){
      var newItem =model.addItem(input.name,input.value);
      view.addListItem(newItem);
      view.cleanInput();//清除買了什麼東西與金額
      updateTotal();
    }

  };


return{
  init:function()
  {
     console.log('App started.');
     view.dispalyMonth();
     view.displaySum({sum:0});
     setupEventListener();
  }
}
})(model,view);

controller.init();//初始化
