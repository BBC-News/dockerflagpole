window.addEventListener("DOMContentLoaded", function(event) {
  Vue.component('flagpole-component', {
    template: `
    <div class="flagpole-container">
      <div class="flagpole-name">{{flagpole.name.toUpperCase()}}</div>
      <div class="flagpole-value">{{flagpole.value?'TRUE':'FALSE'}}</div>
      <button v-on:click="flagpoleToggle">Toggle</button>
    </div> 
  `,
    props: {
      flagpole: Object
    },
    methods:{
      flagpoleToggle: function(){
        let params = {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({name:this.flagpole.name,value:this.flagpole.value?0:1})
        }
        fetch('http://localhost:3000/update', params).then(function(response){
          if(response.ok) {
            this.flagpole.value = !this.flagpole.value;
            console.log("Flagpole '"+this.flagpole.name+"' toggle");
          } else {
            console.log("Toggle of flagpole '"+this.flagpole.name+"' FAILED ("+response.status+")");
          }
        }.bind(this));
      }
    }
  });
  new Vue({
    el: '#app',
    data: {
      flagpoles:[]
    },
    methods: {
      flagpoleToggle : function() {
        console.log("Parent Flagpole TOGGLED");
      },
      loadFlagpoles: function() {
        fetch('http://localhost:3000/get').then(function(response){
          if(response.ok) {
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