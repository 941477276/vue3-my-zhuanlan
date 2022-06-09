<template>
  <div class="component-usage">
    <header class="fixed-header">
      <h2>Modal</h2>
    </header>
    <h3>基本使用</h3>
    <bs-button type="primary" @click="visible = true">显示弹窗</bs-button>
    <bs-button type="primary" @click="visible16 = true">可拖拽弹窗</bs-button>
    <bs-modal
      v-model:visible="visible"
      title="温馨提示">
      <p>这是一个Bootstrap弹窗！</p>
    </bs-modal>
    <bs-modal
      v-model:visible="visible16"
      :draggable="draggable"
      title="温馨提示">
      <p>这是一个可拖拽的弹窗！</p>
      <bs-button type="primary" @click="draggable = true">启用拖拽</bs-button>
      <bs-button type="primary" @click="draggable = false">禁用拖拽</bs-button>
    </bs-modal>

    <hr>
    <h3>不同大小</h3>
    <bs-button type="primary" @click="visible1 = true">小弹窗</bs-button>
    <bs-button type="primary" @click="visible2 = true">默认弹窗</bs-button>
    <bs-button type="primary" @click="visible3 = true">大弹窗</bs-button>
    <bs-button type="primary" @click="visible4 = true">超大弹窗</bs-button>
    <bs-button type="primary" @click="visible5 = true">自定义大弹窗</bs-button>
    <bs-modal
      v-model:visible="visible1"
      size="sm"
      title="温馨提示">
      <p>这是一个小弹窗！</p>
    </bs-modal>
    <bs-modal
      v-model:visible="visible2"
      title="温馨提示">
      <p>这是一个默认大小弹窗！</p>
    </bs-modal>
    <bs-modal
      v-model:visible="visible3"
      size="lg"
      title="温馨提示">
      <p>这是一个大弹窗！</p>
    </bs-modal>
    <bs-modal
      v-model:visible="visible4"
      size="xl"
      title="温馨提示">
      <p>这是一个超大弹窗！</p>
    </bs-modal>
    <bs-modal
      v-model:visible="visible5"
      width="70%"
      title="温馨提示">
      <p>这是一个自定义大小的弹窗，宽度为70%！</p>
    </bs-modal>

    <hr>
    <h3>超长内容及滚动条</h3>
    <bs-button type="primary" @click="visible6 = true">弹窗整体滚动</bs-button>
    <bs-button type="primary" @click="visible7 = true">仅弹窗内容滚动</bs-button>
    <bs-modal
      v-model:visible="visible6"
      title="温馨提示">
      <p>What follows is just some placeholder text for this modal dialog. Sipping on Rosé, Silver Lake sun, coming up all lazy. It’s in the palm of your hand now baby. So we hit the boulevard. So make a wish, I'll make it like your birthday everyday. Do you ever feel already buried deep six feet under? It's time to bring out the big balloons. You could've been the greatest. Passport stamps, she's cosmopolitan. Your kiss is cosmic, every move is magic.</p>
      <p>We're living the life. We're doing it right. Open up your heart. I was tryna hit it and quit it. Her love is like a drug. Always leaves a trail of stardust. The girl's a freak, she drive a jeep in Laguna Beach. Fine, fresh, fierce, we got it on lock. All my girls vintage Chanel baby.</p>
      <p>Before you met me I was alright but things were kinda heavy. Peach-pink lips, yeah, everybody stares. This is no big deal. Calling out my name. I could have rewrite your addiction. She's got that, je ne sais quoi, you know it. Heavy is the head that wears the crown. 'Cause, baby, you're a firework. Like thunder gonna shake the ground.</p>
      <p>Just own the night like the 4th of July! I’m gon’ put her in a coma. What you're waiting for, it's time for you to show it off. Can't replace you with a million rings. You open my eyes and I'm ready to go, lead me into the light. And here you are. I’m gon’ put her in a coma. Come on, let your colours burst. So cover your eyes, I have a surprise. As I march alone to a different beat. Glitter all over the room pink flamingos in the pool.</p>
      <p>You just gotta ignite the light and let it shine! Come just as you are to me. Just own the night like the 4th of July. Infect me with your love and fill me with your poison. Come just as you are to me. End of the rainbow looking treasure.</p>
      <p>I can't sleep let's run away and don't ever look back, don't ever look back. I can't sleep let's run away and don't ever look back, don't ever look back. Yes, we make angels cry, raining down on earth from up above. I'm walking on air (tonight). Let you put your hands on me in my skin-tight jeans. Stinging like a bee I earned my stripes. I went from zero, to my own hero. Even brighter than the moon, moon, moon. Make 'em go, 'Aah, aah, aah' as you shoot across the sky-y-y! Why don't you let me stop by?</p>
      <p>Boom, boom, boom. Never made me blink one time. Yeah, you're lucky if you're on her plane. Talk about our future like we had a clue. Oh my God no exaggeration. You're original, cannot be replaced. The girl's a freak, she drive a jeep in Laguna Beach. It's no big deal, it's no big deal, it's no big deal. In another life I would make you stay. I'm ma get your heart racing in my skin-tight jeans. I wanna walk on your wave length and be there when you vibrate Never made me blink one time.</p>
      <p>We'd keep all our promises be us against the world. If you get the chance you better keep her. It's time to bring out the big, big, big, big, big, big balloons. I hope you got a healthy appetite. Don't let the greatness get you down, oh, oh yeah. Yeah, she's footloose and so fancy free. I want the jaw droppin', eye poppin', head turnin', body shockin'. End of the rainbow looking treasure.</p>
    </bs-modal>
    <bs-modal
      v-model:visible="visible7"
      scrollable
      title="温馨提示">
      <p>What follows is just some placeholder text for this modal dialog. Sipping on Rosé, Silver Lake sun, coming up all lazy. It’s in the palm of your hand now baby. So we hit the boulevard. So make a wish, I'll make it like your birthday everyday. Do you ever feel already buried deep six feet under? It's time to bring out the big balloons. You could've been the greatest. Passport stamps, she's cosmopolitan. Your kiss is cosmic, every move is magic.</p>
      <p>We're living the life. We're doing it right. Open up your heart. I was tryna hit it and quit it. Her love is like a drug. Always leaves a trail of stardust. The girl's a freak, she drive a jeep in Laguna Beach. Fine, fresh, fierce, we got it on lock. All my girls vintage Chanel baby.</p>
      <p>Before you met me I was alright but things were kinda heavy. Peach-pink lips, yeah, everybody stares. This is no big deal. Calling out my name. I could have rewrite your addiction. She's got that, je ne sais quoi, you know it. Heavy is the head that wears the crown. 'Cause, baby, you're a firework. Like thunder gonna shake the ground.</p>
      <p>Just own the night like the 4th of July! I’m gon’ put her in a coma. What you're waiting for, it's time for you to show it off. Can't replace you with a million rings. You open my eyes and I'm ready to go, lead me into the light. And here you are. I’m gon’ put her in a coma. Come on, let your colours burst. So cover your eyes, I have a surprise. As I march alone to a different beat. Glitter all over the room pink flamingos in the pool.</p>
      <p>You just gotta ignite the light and let it shine! Come just as you are to me. Just own the night like the 4th of July. Infect me with your love and fill me with your poison. Come just as you are to me. End of the rainbow looking treasure.</p>
      <p>I can't sleep let's run away and don't ever look back, don't ever look back. I can't sleep let's run away and don't ever look back, don't ever look back. Yes, we make angels cry, raining down on earth from up above. I'm walking on air (tonight). Let you put your hands on me in my skin-tight jeans. Stinging like a bee I earned my stripes. I went from zero, to my own hero. Even brighter than the moon, moon, moon. Make 'em go, 'Aah, aah, aah' as you shoot across the sky-y-y! Why don't you let me stop by?</p>
      <p>Boom, boom, boom. Never made me blink one time. Yeah, you're lucky if you're on her plane. Talk about our future like we had a clue. Oh my God no exaggeration. You're original, cannot be replaced. The girl's a freak, she drive a jeep in Laguna Beach. It's no big deal, it's no big deal, it's no big deal. In another life I would make you stay. I'm ma get your heart racing in my skin-tight jeans. I wanna walk on your wave length and be there when you vibrate Never made me blink one time.</p>
      <p>We'd keep all our promises be us against the world. If you get the chance you better keep her. It's time to bring out the big, big, big, big, big, big balloons. I hope you got a healthy appetite. Don't let the greatness get you down, oh, oh yeah. Yeah, she's footloose and so fancy free. I want the jaw droppin', eye poppin', head turnin', body shockin'. End of the rainbow looking treasure.</p>
    </bs-modal>

    <hr>
    <h3>居中显示</h3>
    <bs-button type="primary" @click="visible8 = true">居中显示</bs-button>
    <bs-button type="primary" @click="visible9 = true">带有滚动条的</bs-button>
    <bs-modal
      v-model:visible="visible8"
      centered
      title="温馨提示">
      <p>这是一个居中的弹窗！</p>
    </bs-modal>
    <bs-modal
      v-model:visible="visible9"
      scrollable
      centered
      title="温馨提示">
      <p>What follows is just some placeholder text for this modal dialog. Sipping on Rosé, Silver Lake sun, coming up all lazy. It’s in the palm of your hand now baby. So we hit the boulevard. So make a wish, I'll make it like your birthday everyday. Do you ever feel already buried deep six feet under? It's time to bring out the big balloons. You could've been the greatest. Passport stamps, she's cosmopolitan. Your kiss is cosmic, every move is magic.</p>
      <p>We're living the life. We're doing it right. Open up your heart. I was tryna hit it and quit it. Her love is like a drug. Always leaves a trail of stardust. The girl's a freak, she drive a jeep in Laguna Beach. Fine, fresh, fierce, we got it on lock. All my girls vintage Chanel baby.</p>
      <p>Before you met me I was alright but things were kinda heavy. Peach-pink lips, yeah, everybody stares. This is no big deal. Calling out my name. I could have rewrite your addiction. She's got that, je ne sais quoi, you know it. Heavy is the head that wears the crown. 'Cause, baby, you're a firework. Like thunder gonna shake the ground.</p>
      <p>Just own the night like the 4th of July! I’m gon’ put her in a coma. What you're waiting for, it's time for you to show it off. Can't replace you with a million rings. You open my eyes and I'm ready to go, lead me into the light. And here you are. I’m gon’ put her in a coma. Come on, let your colours burst. So cover your eyes, I have a surprise. As I march alone to a different beat. Glitter all over the room pink flamingos in the pool.</p>
      <p>You just gotta ignite the light and let it shine! Come just as you are to me. Just own the night like the 4th of July. Infect me with your love and fill me with your poison. Come just as you are to me. End of the rainbow looking treasure.</p>
      <p>I can't sleep let's run away and don't ever look back, don't ever look back. I can't sleep let's run away and don't ever look back, don't ever look back. Yes, we make angels cry, raining down on earth from up above. I'm walking on air (tonight). Let you put your hands on me in my skin-tight jeans. Stinging like a bee I earned my stripes. I went from zero, to my own hero. Even brighter than the moon, moon, moon. Make 'em go, 'Aah, aah, aah' as you shoot across the sky-y-y! Why don't you let me stop by?</p>
      <p>Boom, boom, boom. Never made me blink one time. Yeah, you're lucky if you're on her plane. Talk about our future like we had a clue. Oh my God no exaggeration. You're original, cannot be replaced. The girl's a freak, she drive a jeep in Laguna Beach. It's no big deal, it's no big deal, it's no big deal. In another life I would make you stay. I'm ma get your heart racing in my skin-tight jeans. I wanna walk on your wave length and be there when you vibrate Never made me blink one time.</p>
      <p>We'd keep all our promises be us against the world. If you get the chance you better keep her. It's time to bring out the big, big, big, big, big, big balloons. I hope you got a healthy appetite. Don't let the greatness get you down, oh, oh yeah. Yeah, she's footloose and so fancy free. I want the jaw droppin', eye poppin', head turnin', body shockin'. End of the rainbow looking treasure.</p>
    </bs-modal>

    <hr>
    <h3>自定义弹窗</h3>
    <bs-button type="primary" @click="visible10 = true">自定义头部和底部</bs-button>
    <bs-modal
      v-model:visible="visible10"
      size="sm">
      <template #header>
        <div class="modal-title" style="color: #f60;text-align: center;flex: 1;">自定义头部</div>
      </template>
      <p>这是一个自定义弹窗的弹窗！</p>

      <template #footer>
        <bs-button type="danger" block @click="visible10 = false">确定</bs-button>
      </template>
    </bs-modal>

    <hr>
    <h3>异步关闭</h3>
    <bs-button type="primary" @click="visible11 = true">删除用户</bs-button>
    <bs-modal
      title="温馨提示"
      :can-close="canClose11"
      v-model:visible="visible11"
      :on-ok="deleteUser">
      <h5>确定要删除此用户吗？删除后将不可恢复！</h5>
      <p>在“确定”按钮转圈圈期间点击任何位置都无法关闭弹窗！</p>
    </bs-modal>

    <hr>
    <h3>弹窗嵌套</h3>
    <bs-button type="primary" @click="visible12 = true">显示弹窗</bs-button>
    <bs-modal
      title="一级弹窗"
      v-model:visible="visible12"
      size="sm">
      <h5>一级弹窗</h5>
      <bs-button type="primary" @click="visible13 = true">显示二级弹窗</bs-button>
      <bs-modal
        title="二级弹窗"
        v-model:visible="visible13">
        <h5>二级弹窗</h5>
        <bs-button type="primary" @click="visible14 = true">显示三级弹窗</bs-button>
        <bs-modal
          title="三级弹窗"
          size="lg"
          v-model:visible="visible14">
          <h5>三级弹窗</h5>
        </bs-modal>
      </bs-modal>
    </bs-modal>

    <hr>
    <h3>全屏弹窗</h3>
    <bs-button type="primary" @click="visible15 = true">显示全屏弹窗</bs-button>
    <bs-modal
      title="全屏弹窗"
      fullscreen
      v-model:visible="visible15">
      <p>这是一个全屏弹窗！</p>
    </bs-modal>
  </div>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue';

export default defineComponent({
  name: 'BsModalUsage',
  components: {},

  setup () {
    let visible = ref(false);
    let visible1 = ref(false);
    let visible2 = ref(false);
    let visible3 = ref(false);
    let visible4 = ref(false);
    let visible5 = ref(false);
    let visible6 = ref(false);
    let visible7 = ref(false);
    let visible8 = ref(false);
    let visible9 = ref(false);
    let visible10 = ref(false);
    let visible11 = ref(false);
    let visible12 = ref(false);
    let visible13 = ref(false);
    let visible14 = ref(false);
    let visible15 = ref(false);
    let visible16 = ref(false);
    let draggable = ref(true);

    let canClose11 = ref(true);
    let deleteUser = function () {
      if (!canClose11.value) {
        return;
      }
      canClose11.value = false;
      return new Promise(function (resolve) {
        let timer = setTimeout(function () {
          clearTimeout(timer);
          canClose11.value = true;
          // 如果这里resolve(false)则弹窗不会主动关闭
          // resolve(true);
          resolve(true);
        }, 3000);
      });
    };
    return {
      visible,
      visible1,
      visible2,
      visible3,
      visible4,
      visible5,
      visible6,
      visible7,
      visible8,
      visible9,
      visible10,
      visible11,
      visible12,
      visible13,
      visible14,
      visible15,
      visible16,
      draggable,

      canClose11,

      deleteUser
    };
  }
});
</script>

<style lang="scss" scoped>
.component-usage{
  padding-top: 60px;
  min-height: 1000px;
}
.fixed-header{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
  text-align: right;
  background-color: #fff;
}
</style>
