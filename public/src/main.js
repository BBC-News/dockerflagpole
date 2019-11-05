window.addEventListener("DOMContentLoaded", function(event) {
  Vue.component('flagpole-control-edit', {
    model: {
      prop: 'checked',
      event: 'change'
    },
    props: {
      label: String,
      name: String,
      checked: Boolean
    },
    template: `
        <div class="flagpole-edit">
          <input type="radio" v-bind:checked="checkedvalue" :name="name"
          v-on:change="$emit('change', $event.target.checked)">
          <span>Turn {{name}} "{{label}}"</span>
        </div>
  `,
    mounted : function(){
      console.log("Mounted")
    },
    onUpdate: function(){

    }
  })

  Vue.component('flagpole-component', {
    template: `
    <div class="flagpole-container" v-on:update="flagpoleUpdate">
      <div class="flagpole-info">
        <div class="flagpole-name">Flagpole name : {{flagpole.name.toUpperCase()}}</div>
        <div class="flagpole-value">Current value : {{flagpole.originalValue?'TRUE':'FALSE'}}</div>
      </div>
      <div class="flagpole-control-edit-container">
        <div v-on:change="onFlagpoleEditTrue">
            <flagpole-control-edit label="ON" :name="flagpole.name.toUpperCase()" v-bind:checked="flagpole.truevalue"></flagpole-control-edit>
        </div>
        <div v-on:change="onFlagpoleEditFalse">
            <flagpole-control-edit label="OFF" :name="flagpole.name.toUpperCase()" v-bind:checked="flagpole.falsevalue"></flagpole-control-edit>
        </div>
      </div>
      <button class="update-button" v-on:click="flagpoleUpdate">Update</button>
    </div>
    `,
    props: {
      flagpole: Object
    },
    beforeMount : function() {
      this.flagpole.originalValue = this.flagpole.value;
      this.flagpole.truevalue = this.flagpole.value === true;
      this.flagpole.falsevalue = this.flagpole.value === false;
      console.log("Mounted Flagpole :"+this.flagpole.name.toUpperCase()+
        " -- "+(this.flagpole.value?'TRUE':'FALSE'))
    },
    methods:{
      onFlagpoleEditTrue: function($event){
        this.flagpole.valueUpdated = this.flagpole.originalValue !== true;
        this.flagpole.truevalue = $event.target.checked;
        this.flagpole.falsevalue = !this.flagpole.truevalue;
      },
      onFlagpoleEditFalse: function($event){
        this.flagpole.valueUpdated = this.flagpole.originalValue !== false;
        this.flagpole.falsevalue = $event.target.checked;
        this.flagpole.truevalue = !this.flagpole.falsevalue;
      },
      flagpoleUpdate: function(){
        if (this.flagpole.valueUpdated) {
          let newValue = this.flagpole.truevalue===true,
            params = {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: this.flagpole.name, value: newValue ? 1 : 0})
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