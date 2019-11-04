window.addEventListener("DOMContentLoaded", function(event) {
  Vue.component('flagpole-control-edit', {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      checked: Boolean
    },
    template: `
        <input type="checkbox" v-bind:checked="checked" 
        v-on:change="$emit('change', $event.target.checked)">
  `,
    mounted : function(){
      console.log("Mounted")
    }
  })

  Vue.component('flagpole-component', {
    template: `
    <div class="flagpole-container" v-on:change="onFlagpoleEdit" v-on:update="flagpoleUpdate">
      <div class="flagpole-name">{{flagpole.name.toUpperCase()}}</div>
      <div class="flagpole-value">{{flagpole.value?'TRUE':'FALSE'}}</div>
      <div class="flagpole-control-edit-container">
        <flagpole-control-edit :checked="flagpole.value"></flagpole-control-edit>
      </div>
      <button v-if="flagpole.valueUpdated" v-on:click="flagpoleUpdate">Update Flagpoles</button>
    </div>
    `,
    props: {
      flagpole: Object
    },
    mounted : function() {
      console.log("Mounted Flagpole :"+this.flagpole.name.toUpperCase()+
        " -- "+(this.flagpole.value?'TRUE':'FALSE'))
    },
    methods:{
      onFlagpoleEdit: function($event){
        if (this.flagpole.originalValue === undefined){
          this.flagpole.originalValue = this.flagpole.value
        }
        this.flagpole.valueUpdated = this.flagpole.originalValue !== $event.target.checked;
        this.flagpole.value = $event.target.checked;
        console.log("Flagpole Edited:"+this.flagpole.name.toUpperCase()+
          " now "+(this.flagpole.value?'TRUE':'FALSE'))
      },
      flagpoleUpdate: function(){
        if (this.flagpole.valueUpdated) {
          let params = {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: this.flagpole.name, value: this.flagpole.value ? 1 : 0})
          }, baseURL = this.$parent.baseURL
          fetch(baseURL+'update', params).then(function (response) {
            if (response.ok) {
              this.$parent.loadFlagpoles()
            } else {
              console.log("Update of flagpoles FAILED (" + response.status + ")");
            }
          }.bind(this));
        }
      }
    }
  })


  new Vue({
    el: '#app',
    data: {
      flagpoles:[]
    },
    mounted: function(){
      this.baseURL = window.document.URL;
      this.loadFlagpoles()
    },
    methods: {
      loadFlagpoles: function() {
        fetch(this.baseURL+'get').then(function(response){
          if(response.ok) {
            this.flagpoles = [];
            response.json().then(function(_data){
              this.flagpoles = _data
            }.bind(this));
          } else {
            this.message = "Error fetching Flagpoles"
          }
        }.bind(this));
      }
    }
  })
})