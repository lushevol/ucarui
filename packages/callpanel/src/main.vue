<template>
  <!-- 
  <free-transform
    :key="id"
    :x="0"
    :y="0"
    :scale-x="1"
    :scale-y="1"
    :width="500"
    :height="500"
    :angle="0"
    :offset-x="50"
    :offset-y="50"
    :disable-scale="true"> 
  -->
  <transition name="el-callpanel-fade">
    <div
      :class="['el-callpanel', customClass, horizontalClass, mediaClass, sizeClass, progressClass]"
      v-show="visible"
      :style="positionStyle"
      @click="click"
      role="alert"
    >
      <div class="el-callpanel__header">
        <i class="el-callpanel__icon"
          :class="[ typeClass, iconClass ]"
          v-if="type || iconClass">
        </i>
        <span class="el-callpanel__title" v-text="callText"></span>
        <div class="operation">
          <div class="mic" @click="show.mic = !show.mic">
            <img v-show="show.mic" src="~examples/assets/images/mic.svg" title="禁止麦克风">
            <img v-show="!show.mic" src="~examples/assets/images/nomic.svg" title="开启麦克风">
          </div>
          <div class="sound" @click="show.sound = !show.sound">
            <img v-show="show.sound" src="~examples/assets/images/sound.svg" title="点击静音">
            <img v-show="!show.sound" src="~examples/assets/images/mute.svg" title="取消静音">
          </div>
          <div class="record" @click="makeRecord" v-if="mediaClass === 'audio'">
            <img src="~examples/assets/images/record.svg" />
          </div>
          <div class="expand" @click="toggleSize" v-else-if="mediaClass === 'video'">
            <img src="~examples/assets/images/shrink.svg" v-if="show.fullSize"/>
            <img src="~examples/assets/images/expand.svg" v-else/>
          </div>
          <!-- <el-dropdown @command="handleCommand">
            <span>...</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="record">录音</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </div>
      <transition>
        <div class="el-callpanel__tips" v-show="showTips">
          <div class="record" v-show="show.record">
            <span v-if="record.clock > 0">录音时长：{{recordTimerMin}}:{{recordTimerSec}} </span>
            <span v-else>正在录音...</span>
            <a @click="finishRecord" style="cursor: pointer;">完成</a>
          </div>
        </div>
      </transition>
      <div :class="['el-callpanel__video', mainClass]" v-if="mediaClass === 'video'" @click="toggleVideoMain" title="点击切换">
        <video id="remoteVideo" poster="http://img1.cache.netease.com/catchpic/F/F0/F05747B94429488D18E438BB2768E6CA.jpg"></video>
        <video id="localVideo" muted="muted"></video>
        <div class="el-callpanel__video_timer" v-if="info.timerClock > 0" style="display: none">
          <h3 class="clock">{{timerMin}} : {{timerSec}}</h3>
        </div>
        <div class="el-callpanel__controller" style="display: none">
            <el-button type="success" icon="el-icon-phone" @click.stop="acceptCall" v-if="call.progress === 0 && call.direction === 'in'" circle></el-button>
            <el-button type="danger" icon="el-icon-phone" @click.stop="hungupCall" circle></el-button>
        </div>
      </div>
      <div class="el-callpanel__content">
        <div class="el-callpanel__content_avatar">
          <a>
            <img class="avatar_pic" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAbg0lEQVR4Xu1dCbhNZdu+kUb9oQwJUUqDqE8hOqGIcImiga9JEun7jaEkUxkSKRmuhMrBZ+4rqo+SIUNKaZAhn5+QTnT0kTHxX/dq7dO27WGtvdfwrnc9z3Xt6xzOu97hfte913rf93nuJx/E3ESgOIArAFQEUAZAYQDnJvkUNTuTC2B/gs8+AP8FsB3ABvOz281BhLnufGEevENjPw1ABZMEETLwJz9FHGojVTUkFMmyMYo0/H0zgD9SXSx/T4yAEMT+3XEGgJoA6gCoDaAGAP6finYEwCoAi80Pfz+sYkdV7ZMQJPXM8OavFUWI6goTItVohDCpEIr5uxAkPmD/A6ApgLsANARwpk1cg1L8EIAPAMwC8A6A34LSca/6KQT5C2muF5qbpKgH4HSvJkGRdvh0WQhgNoC55kaAIl3zrxthJ8gFJiFamK9QXHCLAccALDKfLCTLnrCCElaCtAVwP4CbwzrxNsfNRf4UAK/bvC7wxcNEkHMAPAagK4CLAj9z/gxgJ4DhAF4DcMCfLnjbahgIwsO3TgCeABA5iPMWZf1a+wXAKAAvA/hVv+H9NSKdCXIhgB4AHgXAp4eY8whw14tPkxcB7HK+ev9r1JEglwF4CsDD/sMbqh5MAjDIPL3XZuA6EYRnF88B+Ic2sxPMgbwCoLcuZyq6EIQ7UiMAcNtWzH8EcgB0ATDN/65k1oOgE+RSABNluzazm8DFq3mW0g7Af1xsw9Wqg0oQun48A+DJEJ54u3pDuFA5T+iHABgMgL8HyoJIkNvMnZOLA4W0dHaL+TT5KEhQBIkgdAN5AUBnAEHqd5DuB7f7esJcK/bCn+4syltQbrRyAGYAuEF5RKWDVhBYDYD+b4yKVNqCQJBmACYDKKQ0ktI5uwgwbLg1gPl2L/SyvMoEYaDSSADtvQRE2vIcgdEAuqm6gFeVINy+/ReAqz2fLmnQDwTWAbhDxe1gFQlyNwC6LZztx0xJm74hcNB0D+JaUxlTjSDcL++pDDrSET8QGACgrx8Nx2tTFYKwH3xqPKgKMNIPXxEYC6AjAG4L+2oqEKQggH8CuNNXJKRx1RCYCaCV3+clfhPkLABvA+DpuJggEIvAewAa+wmLnwShBOeHAKr5CYC0rTwCywA0AUDJVc/NL4JQs5bkuMbzEUuDQUTgawC3AGCor6fmB0HOB7ACwOWejlQaCzoC1B6+yWuSeE0Qnm2QHFWCPlvSf18Q+BJAlpeKKl4ShN64VO6j6LOYIJAuAgzCauDV7pZXBGE73Laj1q2YIJApAryX7vHinMQrgvDgR5wOM70t5PpoBOjkSK0zV80LglCCh3IwYoKA0whQ92yY05VG1+c2Qe4DMNXNAUjdoUeAijbZbqHgJkF4Os6T0AJudV7qFQTMFHM8SGSeE8fNLYJQ3fArAHQlERME3EaArvKVAPyf0w25QRBu534G4FqnOyv1CQJJEOAZCd2WHBWDcIMgXDR1l6kUBHxAgNpbTzvZrtMEudX0sXKyj9rVVb16dVSrVg01atTARRf9lark4MGDyMnJMT4//fST8XPbtm1YsYLOB2IWEGD8CA+il1ooa6mIkwShLu560ceNj3ubNm3w0EMPISuLnhL27JdffsGMGTMwffp0LFmyxN7F4Sv9E4CrAOx1YuhOEoTeuXyCiJkIlClTBh07dkS7du1QpAhzhGZuu3btwpQpUzB06FDs2RPa1IGpgKSUEHe2MjanCMKUA5S9F6PsY7586NmzJwYMGICCBRkw6bzt27cPgwYNwsiRI3HkSOAkb50H5NQaOwAYl2lDThDkCvPVKtO+aHF9yZIlMXXqVNStW9eT8WzdutUgI1/BxE5BgPfmxkxwcYIgywHUzKQTulzbqFEjZGdnO/Y6ZQeXmTNnolWrVjh2zNFdTjtdULEs703GkKRtmRJEXElM6O+8807Mnj077Ylw4kIu4Js2bQq+fonlIcB7lKIgaVkmBOEpOSXtS6bVskYXVa1aFcuXL8cZZ1At1V/buHEjbr31VuzcyYzNYmZy0QoAeNpu2zIhCDObUlM11MZzjLVr1+KCC9TJ/sYzlIYNG+Krr+jtI2Zm4WWyJduWLkEqAqCeaugdEb/++mtcc4162hN79+7F9ddfjy1b+JAPvf1h+moxrt2WpUsQWZjza+nFF9Gtm7oP0Q0bNhgkOXDggK2bQtPCaS3Y0yGILMypHJCVZZxq88xDZZs/fz6aNHHkzEzlYVrtm+0Fu93ZpdjbprAvzAsVKoTvv/8ePPMIgvXr1w/9+/cPQlfd7uMuALYW7HYJwsyyA90eher1z5o1C3fdFRz9iRMnThhPkffeY/xa6I338PNWUbBDEG7r/gigsNXKdSxXv359LFiwIHBDo8Nj2bJlQY/hkBudGOlCfcgKDnYI0slMiWalXm3LfPrpp4arehCNr1l83RLD/wIYZQUHqwRhlOAPAC60UqmuZRo3box58+YFdnjczeJTJDc3N7BjcKjjfBO62Er0oVWCPAxgokOdC2w1PBCsUiXYqqnDhw9H9+4S8Gkma3or1c1ohSAsQ49ICjGE1po3b445c+YEfvyHDx9GuXLljGjFkBt3Y+ntmzSLlRWCcLtmVsjBxMcff4w6dfSQFX722WcxcGDoNyN5SzczsyknvL2tEOTbsKdjLlasmPGNq/qhoNUvsc8//xw33HCD1eI6l/scQFIgUhGknqnIrjNIKcfWuXNnvPTSSynLBalAqVKlwPBdMUPkIWGgfyqC0I+eKtqhtlWrVoFKJDpZhw4dMG5cxhGpOkDCe5wuKHEtGUEKAdgN4EwdUEh3DHRn37FjR7qXK3vd+++/D0ZAihkHhiUA7I+HRTKCPGTmLg81hr169cLgwdQj08uOHj2KwoUL49AhSwfKeg3+1NE8CCDulm8ygoiMD1XwPvzQiNDT0W688Ubw9VEM9B1i1qpTLBFBSgGQmE2qj+3da3zT6miMo587d66OQ0tnTHzN+jn2wkQEYRQQQ2pDbSVKlDAkQHU1itqNGTNG1+HZHVeXeL6GiQhCpezQq7MH1XPX6p3x3HPPoU+fPlaL614u7plIPIJQ15Tx5qE3htMyrFZXmzBhAtq2bavr8NIZF92pNkdfGI8g3LLplU7tul0zadIkQ3BaV5Nw3FNmlv43z6YiCJ8efIqE3nhWQPkcXW3dunWoVImJmcRMBKiTdNLSIvYJUhTALwLXnwisXr1ae58lXfzLHLxnKXCWx4FYgrQEICrIJtoUZqhQgTH++trll19uCFCI5SHQHMDbkX/FEoTJ2R8XsP5EgB68xYsX1xqO22+/HR984EqC2KDi9jKAzokIIuuPqGllcJEKertu3mlM7jN+/Hg3mwha3SetQ6KfILL+iJpKvpsfP348aJNru7+imRUXsrx1SDRBZP0RhRXFqHfvpjOz3sanB58iYichkLcOiSaIrD+iMCpfvnwohJ/lLCTuV0PeOiSaILL+iMKKiu1Ubtfdli1bhptvvln3YdodX946JEIQpmANvVhSNIrMYb5y5Uq7wAauPBP/3HRTRlnKAjdmix0mJ36NEKQWgE8sXhiKYrVr18bixYu1H6sQJOEUM+/myghBJHowBicKxFEoTndbsWIFatXi96NYDAJGlGGEIEMA9BSI/kKgdOnS2L59u/aQUGuYr5NipyAwCEDvCEEoGcitLTETgbPOOisUSuiikZXwlqdYYssIQUIvDhcPpiNHjuD000/X+ktjzZo1Rpo2sVMQ4BZmlQhBDgPwP4exYrNEuR/K/uhsQpCEs3uEklckSHkz37nO90FaY2Ma5cqVK6d1bVAuEoIknamyJAjlTsSdMw5OixYtQt26dYNyr6fVTyFIUtjqkSDMtsOjdbEYBKZNm4Z7771Xa1yEIEmn93ESRGLQE2DUu3dvUPlDZ2MsCGNCxOIiMJAEeRVARwHoVASCnnLNypxStb5r165WioaxzEgS5E0AD4Rx9KnGrKtwdfS4JWAq6V0wgQSRQ8IkGDF9ctGijCXT07KysvDJJ+KGl2B2Z5AgFO6tr+f0Zz6qhQsXol495hHS084555xQeAykOXvvkSD06RZnnAQIDhs2TNussIyY1F2UIk1iRC5bRoKIm0kSFFu3bo3s7OwMcVbz8qVLl4Ju/WIJEVhLgmwDUFZAio8AE3gyl1+BAgW0g+iZZ57B888/r924HBzQf0gQRhIyekosAQI6SpBSsYW7dDqnd3Dghv6ZBEmaSN2BRgJfRatWrTBlypTAjyN6ACLWYGk6D5Ig9FrU26fbEhaJC1E8bs+ePShUiHlN9TDJLmVpHo+SIBTq1Xej3xIOqQu98cYbePBBRmEG30h27l6dOCEvDylmM1cW6RbvdybyZEJPHYxb1z169NBhKG6PYRsJInpYFmHetm0bypYN/oZfxYoVsWnTJoujDnWxb0kQ5gGuHmoYLA6+RYsWmDlzpsXSahZjVluuP8QsIbCKBJF86Jaw+rMQ3cMbNIibUttGLf4UZUpr5gPhGkTMEgILSRAmC7nDUnEpZJwdMOEMVU+CZgz+mj59etC67Wd/55Ag9KNo7WcvgtY2X1FmzZqFIKUvGzt2LB5/XHIj2bzXDOG4sQDa27ww9MV79uyJIUOot6e+0SOZr4WyrWt7rkaTIMMAdLd9qVyAiRMn4uGHH1YaifXr1xu6VwcPHlS6n4p2bggJwnjL4Yp2UOlu5c+fHzxTUDVkldrC9evXl0V5+ndRJxKkMYB56dchV9JXa9KkSUqpMPJQs2nTpjh06JBMUPoINCRBmOdY8gCnD6Jx5VVXXYUZM2bg6quvzrCmzC+nY+UDDzwQihyLmaOVtIbyJAgDHeiwqF/Ag8voxVZfsGBB9OnTB0899RROO+00j1sHfvvtN3Tr1g2vvfaa521r2GCe9CjHth7AFRoO0pchdenSBSNGjPC0bcqkNmvWDFu3bvW0XY0bY6TtNRHxajksdHCmH3vsMYwbN87BGlNXNXToUPTq1St1QSlhFYHZAFpECDIUgLh3WoUuRTkhiENA+lvNSQl0uJk/0d/+6NO6EESLuaSY4uTIE4RpTpdpMSwFBiEEUWASMu/CjfR0jxBE0kBnDmheDUIQB8H0r6rzAOyLEITdkMAphyZDCOIQkP5VY+xgsflogowGIO6eGU4K3eBfffVVtGnTJsOa7F0uu1j28EpRmhkP/hFLkJYAZjjaTIgqo/JJhw4djK3WEiVKeD7y/fv3Y/To0YZvWG4upc7EMkCgBQBu8570BDkfgISa2USVxOArFYlx4YUX2rza+eL02uUZzAsvvICcnBznGwhHjVyT/xpLEFmH2Jh8pod+9NFHDbcSFTPhHj58GBMmTDCkRSmdKmYZgW8A5GVujV6DsAZZh6TAkf5WjzzyCJierXTp0pZR96vg0aNH8eabbxqp5H744Qe/uhGkdkeZeTuNPscSRNYhCaaSxGBwFIkRROmfY8eOYerUqRg4cCA2b94cpBvW675S8mVupNFYgsg6JGY66JVLRUUqoZcrV87ryXK8PYpW0y2/X79+2Lhxo+P1a1Bh3voj3hNE1iHmDJMY999/v0GMSy65RIN5P3kIjE9/++230bdvX3zzDV+7xQB8DaBKNBKxTxD+jUoEPcMMF1VLeK5QoQJjyfS3efPmGZsN337L87FQG3N+90lFEIbEhRKpyy67DKNGjQqsMFymtzYX808//TR+/PHHTKsK6vWXAtiSiiD8+9rYR01QR2y139wO5c0hBmPHa/DgwWFTQvkcwA2x8x/vFYtlngTwQhhulpo1axrboGF5nbI6p8w8RbWWadOmWb0k6OW6ABhplSClAOwM+oiT9Z/pjyn8RrVByveIxUfgnXfeMQ5Ef/75Z90hKg5gt1WCsNxHAG7REZU6depg8uTJgTjoUwF/il537twZb731lgrdcaMP/wbQMF7FiV6xWJbuqBPc6I1fdRYpUgQvv/yysX0rZh8BJjOlF4GGritG9KBdgpxrpmcraB9K9a6455578Morrxipx8TSR2Dfvn3o3r07xo8fn34lal152MzyzJ+nWLInCAvT/Z3uJ4G1kiVL4vXXX0fjxhSQFHMKgcWLFxtP4h07djhVpV/1TE2W3SAVQeoBWOhXzzNtt127dobb93nnMXpSzGkEKFRHN/8xY8YEWTn+VgCLEmGTiiC8jn4IlZwG1836ypcvb2zdZmVludmM1G0isHz5crRu3RrM4Rgw+wJA1WR9tkKQuwDMCsrA/VA1DAo2bveTW8LcNt+5MzAnBCd57sbDxwpBWGYDgMvdBjiT+hnmStFmpmsW8w8BLuJ5bkKPYcWNgu0VASRNFm+FIByn0sJyFEigD9XZZ5+t+JyEp3tMLsQtYYXtQQApD3asEoRS5XzB5Am7UsZF+JNP0jNGTDUEVq9ebSTw4VNFMWMMMhPeH0vVL6sEYT2d4vmqpGrAzb+PHDkSnTqxW2KqIrBo0SIVX3ufMMPLU8JmhyDMe8zVFyOufDdZjPs+BZY7wFBf7nIpYlTuuQjAUSv9sUMQ1sdgkgFWKnazTLVq1bBy5UpxMnQTZIfrpi8X3XwUMMY0DLbaD7sEofsJA5l9E4AqVKiQESKqQ3y41UnSpRwD0nwWjPgJAOOnLSdutEsQzhWfldl+TRqVA+kLJBY8BJiv/bbbbvOz4/fYVQ9NhyAc4CcAank9Up6Qb9lyUkSk112Q9jJEoG7duqAflw+2Ip17Nl2CMJ8h49Y9Tfw5aNAgQ1xALLgIvPvuu0Z6ao/td1Ot3bbOUboE4fiYpZJhip7Z9u3bJcjJM7TdaYiSqFxH/vHHH+40EL9Who+npdSTCUG4YOf7zgVejJSuJIyTFgs+AlWrVsUXX9BP0BOzvTCP7lUmBGE9f08UieX00KtUqYK1aym2IhZ0BBo1agRGJ3pk9wKYnm5bmRKE7XqyYCeo8+fPT3eccp1CCFSvXh10Q/HA0lqYO/kEYV1XAvjO7cHWqFHDOBwUCz4CVJRhHhMPjJtJthfmThOE9bUHMNbNARcoUACMYDvzzDPdbEbqdhkBxop4lDbiMQCvZTocJ16xIn2YA6B5ph1Kdj33z2vXru1mE1K3ywiMGDEC3bp1c7kV/AtAMycacZIg3NWiOrZrOQIovEChZbFgInDgwAGUKVMG1Nly0baaGaL2O9GGkwRhf64F8CmA053oXLw6pk+fjrvvvtut6qVeFxGg5m+fPieJpzvdGg8Eqa/7lVMVO00Q9qszgJec6mBsPVyDMPdeq1at3GpC6nUBgRUrVuCWW27BkSNHXKg9r0qmbmYKZ8fMDYKwc9yPbeRYL+NUxDBb5iNnXnIxtRFYt24duAvJTRYXzbF1R3Qf3SJIYXM9UsZFQFCpUiXMmTMHdKMWUxMBPjm4dvz1VyOrslvGcPBrADiy7vCCIGyDHebBxTluocJ6KdRADawWLZj7XUwlBKgyw/yOLvtdkRQ13Ur65NYTJDJPVGb8wAuv3yeeeMJQNhFTAwHG7AwfPtztzlB0oa7pzeFKW24ThJ2mvMobrvQ+plK+anGfvUmTJl40J23EQYDrDe4yfved684VbJ3bmTPdnAgvCML+PwNgoJsDia6buyWjR4/GFVfQ00DMCwSYh52JT/v374/ff+duq+vWC8BQt1vxiiAcB58ifJp4YnRNad++PQYMGICiRYt60mZYG2G+dW67e+jCzrw1bb3A20uCMPrwHbe3f2NBo7I7SULNWOY+F3MOAW7bMvkp1xoePTXYea5pmcviuHMjSVyTlwRhL3hoQff4v3kxuOg2+LrFnIR33HGH101r2R6lRRn+7HHuQvrI0xkvbrIbN4D2miAcAyMQuf1bwY0BpaqTmlpcyNeq5bnmRKquBeLva9asAfOuePg6FcFlE4AbAeR6CZQfBOH4zjcT81zn5WCj22IAFkUgGKkolhoBBjjxdYopDnwwhpJStt9TcnCcfhGEbfMA8V1zH9sHzIF8+fIZW8J0vxY3+vhTsHTpUoMYCxYs8GWOAHwIgO/FnkRYxQ7ST4JE+sJM9Ywb9tWuu+469OjRwziRl8U8DEL07dsXq1at8nNe/gngPj87oAJB2IdXAFBx23djtFvXrl3Rtm1bnHsuQ1zCYwyDzc7ONjR0PTroSwYuI1Qf9xt9FQgSwaCHFwc/VgFn3DR3vO677z40aNAABQtqkQ077vCpl8tEnAwjUCCXBzM+8V540epcuVlOJYJwnDxIfB2AUgcWRYoUQcuWLY3DMCYGzZ8/v5tz4kndlFCiyiE/n332mSdtWmiEanJ8pXLVfcRCP/KKqEYQdoyembMBlLQzEK/KFitWzBBg5uKe2ZPOP58bcurboUOHsGTJEiNkmTtRVKlUzCjwxoSxlOpRxlQkCMEpZn6LKK/QwHMVEoVqgZUrV8all16qzORS5IIZnvhz2bJlyvQrTke4U8UQ0d2qdVJVghAnvsf0A9Db/F017OL2hxGO1157rXG+cuWVV+YRx80Ff25urrGopift+vXr8eWXXxrCbNTBVdzoLtLfdGRNmm3Wr3GoTJAIJowpoXRkoD0OmbqBn8KFCxu7Y5EPA764xon+v9gNgePHj4Mk2L17N3JycrBnzx7jd2oVb9q0Cbt2MSdl4IxPi5YAlqjc8yAQhPgxpxwXbnQ1EAs+AksBMJmN8mrkQSEIbwnubDG3nKSXCi5B+Bo1xMx16Wn+g3QhCxJBImNkDi8eIjHXnFhwEGCqDMqBckEeGAsiQQguhemeNBfwovuj9u1GH6pBAIZZTb2s0nCCSpAIhpQVopuKIzqsKk2MJn2ZC6ATAOUOXaziG3SCRMbZEMA4ABdbHbiUcxUBvk7Rj+rfrrbiQeW6ECQCFYVfB3iAmzSRGAEKdDyvC0C6EYTzQhcVrk/4DSbJRLy5U7nOoCYuE7vmeNOkN63oSJAIcjxYpJA2BY0phSrmPALMY0C1PoqVu6ot6nzXrdWoM0EiCDCoo6OZsrq4NVikVAoE+JTg02I0gAM6oxUGgkTmj69bj5qxBqV1nlQXx/aDuV3LkATlHb2cwCFMBInGi6JjjwCo4QSIIaiDcbcUayMxQmVhJUhkkrktfL+Z771iqGY+9WA3AJgCYDIAphcIpYWdINGTXtUkCgUklAzW8uAOpVswhRJIjDUetKd8E0KQU6eIcSjUYPq7mbVXd+UG5tdghmKS4iOvJD2VZ4bZQSFI8pmiUgPF7RgGTFd7flzNmuXBjcOFNpUtI58vAXgix+7B2BxvQghiH9JSJmEipKHOsGtZfe1376QrmDHziygyMN77xwzrDNXlQpDMp5txKgxEZzISLvT5M/K7V1GQlOTkonpj1E/+vhkAszCJpYmAECRN4CxexoPJCGn4asYTfa5pIp+zY/4vQije8Fwb8MMTarpy7Iv6v/8C4KtShBDKiR1YxEf5Yv8Pz2aYmm/VXlkAAAAASUVORK5CYII="/>
          </a>
        </div>
        <div class="el-callpanel__content_info">
          <p v-text="info.userName"></p>
          <p v-text="info.pnumber"></p>
        </div>
        <div class="el-callpanel__content_timer" v-show="info.timerClock > 0">
          <p>通话时长</p>
          <h3 class="clock">{{timerMin}} : {{timerSec}}</h3>
        </div>
      </div>
      <div class="el-callpanel__controller">
        <div class="accept" v-if="call.progress === 0 && call.direction === 'in'">
          <el-button type="success" icon="el-icon-phone" @click="acceptCall">接听</el-button>
        </div>
        <div class="hungup">
          <el-button type="danger" icon="el-icon-phone" @click="hungupCall">挂断</el-button>
        </div>
      </div>
    <div :style="{ display: 'none' }">
        <audio id="remoteAudio"></audio ><audio id="localAudio" muted="muted"></audio>
        <audio ref="ringTone" loop></audio>
        <audio ref="ringBackTone" loop></audio>
        <audio ref="dtmfTone"></audio>
    </div>
    </div>
  </transition>
  <!-- </free-transform> -->
</template>

<script type="text/babel">
  import ElButton from '../../button';
  // import FreeTransform from 'vue-free-transform';
  const ringToneWav = require('../../../src/assets/sounds/ringtone.wav');
  const ringBackToneWav = require('../../../src/assets/sounds/ringbacktone.mp3');
  const dtmfToneWav = require('../../../src/assets/sounds/dtmf.wav');

  let typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
  };

  export default {
    data() {
      return {
        id: 0,
        visible: false,
        duration: 4500,
        type: '',
        showClose: true,
        customClass: '',
        iconClass: '',
        onClose: null,
        onClick: null,
        onSetSound: null,
        onSetMic: null,
        closed: false,
        verticalOffset: 0,
        timer: null,
        position: 'bottom-right',
        info: {
          userName: '陌生号码',
          pnumber: '未知',
          timerClock: 0
        },
        call: {
          type: 'audio',
          direction: 'in', // in 拨入， out 拨出
          progress: 0 // 0 等待接听，1 通话中， 2 通话结束
        },
        record: {
          clock: 0,
          timer: null
        },
        onAccept: null,
        onHungup: null,
        onRecord: null,
        onRecordDone: null,
        show: {
          record: false, // 录音组件
          mic: true, // 语音按钮
          sound: true, // 声音按钮
          fullSize: false, // 是否是全屏显示
          main: 'remote'
        }
      };
    },
    components: {
      ElButton
      // FreeTransform
    },
    computed: {
      typeClass() {
        return this.type && typeMap[this.type] ? `el-icon-${ typeMap[this.type] }` : '';
      },

      horizontalClass() {
        return this.position.indexOf('right') > -1 ? 'right' : 'left';
      },

      mediaClass() {
        return this.call.type;
      },

      sizeClass() {
        return this.show.fullSize ? 'full-size' : '';
      },

      mainClass() {
        return this.show.main;
      },

      verticalProperty() {
        return /^top-/.test(this.position) ? 'top' : 'bottom';
      },

      positionStyle() {
        return {
          [this.verticalProperty]: `${ this.verticalOffset }px`
        };
      },

      timerSec() {
        return this.info.timerClock % 60;
      },
      timerMin() {
        return Math.floor(this.info.timerClock / 60);
      },
      recordTimerSec() {
        return this.record.clock % 60;
      },
      recordTimerMin() {
        return Math.floor(this.record.clock / 60);
      },
      progressClass() {
        if (this.call.progress === 0) {
          return 'waiting';
        } else if (this.call.progress === 1) {
          return 'calling';
        } else if (this.call.progress === 2) {
          return 'done';
        }
      },
      progressText() {
        if (this.call.progress === 0) {
          return '等待接听';
        } else if (this.call.progress === 1) {
          return '通话中';
        } else if (this.call.progress === 2) {
          return '通话结束';
        }
      },
      callText() {
        return (this.call.type === 'audio' ? '语音' : '视频') + (this.call.direction === 'in' ? '来电' : '拨打');
      },
      showTips() {
        return this.show.record || '';
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      },
      'call.progress': function(newVal) {
        this.$refs.ringTone.pause();
        this.$refs.ringBackTone.pause();
        // 当电话接通时
        if (newVal === 1) {
          this.startTimer();
        } else if (newVal === 2) {
          this.close();
        }
      },
      'show.mic': function(newVal) {
        if (typeof this.onSetMic === 'function') {
          this.onSetMic(newVal);
        }
      },
      'show.sound': function(newVal) {
        if (typeof this.onSetSound === 'function') {
          this.onSetSound(newVal);
        }
      }
    },
    mounted() {
      this.$refs.ringTone.src = ringToneWav;
      this.$refs.ringBackTone.src = ringBackToneWav;
      this.$refs.dtmfTone.src = dtmfToneWav;
      if (this.call.direction === 'in') {
        this.$refs.ringTone.play();
      } else if (this.call.direction === 'out') {
        this.$refs.ringBackTone.play();
      }
    },
    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      click() {
        if (typeof this.onClick === 'function') {
          this.onClick();
        }
      },

      close() {
        this.closed = true;
        this.$refs.ringTone.pause();
        this.$refs.ringBackTone.pause();
        this.clearTimer();
        if (typeof this.onClose === 'function') {
          this.onClose();
        }
      },

      noAlertRing() {
        this.$refs.ringTone.pause();
      },

      noWaitRing() {
        this.$refs.ringBackTone.pause();
      },

      clearTimer() {
        clearInterval(this.timer);
        this.info.timerClock = 0;
      },

      startTimer() {
        if (this.info.timerClock >= 0) {
          this.timer = setInterval(() => {
            this.info.timerClock++;
          }, 1000);
        }
      },
      acceptCall() {
        this.call.progress = 1;
        if (typeof this.onAccept === 'function') {
          this.onAccept();
        }
      },
      hungupCall() {
        if (typeof this.onHungup === 'function') {
          this.onHungup();
        }
        this.call.progress = 2;
      },
      // handleCommand(command) {
      //   switch (command) {
      //     case 'record':
      //       // TODO
      //       this.show.record = true;
      //       if (typeof this.onRecord === 'function') {
      //         this.onRecord();
      //       }
      //       break;
      //     default:
      //       break;
      //   }
      // },
      makeRecord() {
        // TODO
        // 只有当通话中才能够录音
        // 若正在录音（clock > 0），则不能录音
        if (this.call.progress !== 1 || this.record.clock > 0) {
          return false;
        }
        // 展示录音效果
        this.show.record = true;
        // 开始录音计时
        this.startRecordTimer();
        if (typeof this.onRecord === 'function') {
          this.onRecord(this.show.record);
        }
      },
      startRecordTimer() {
        if (this.record.clock >= 0) {
          this.record.timer = setInterval(() => {
            this.record.clock++;
          }, 1000);
        }
      },
      clearRecordTimer() {
        clearInterval(this.record.timer);
        this.record.clock = 0;
      },
      finishRecord() {
        // 展示录音效果
        this.show.record = false;
        this.clearRecordTimer();
        if (typeof this.onRecordDone === 'function') {
          this.onRecordDone();
        }
      },
      toggleSize() {
        this.show.fullSize = !this.show.fullSize;
      },
      toggleVideoMain() {
        if (this.show.main === 'remote') {
          this.show.main = 'local';
        } else if (this.show.main === 'local') {
          this.show.main = 'remote';
        }
      }
    }
  };
</script>

