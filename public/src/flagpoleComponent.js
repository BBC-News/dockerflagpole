Vue.component('flagpole-component', {
  template: `
    <div class="flagpole-container">
      <div class="flagpole-name">{{flagpole.name}}</div>
      <div class="flagpole-value">{{flagpole.value?'TRUE':'FALSE'}}</div>
    </div> 
  `,
  props: {
    flagpole: Object
  }
});