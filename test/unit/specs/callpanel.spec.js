import Vue from 'vue';
import { triggerEvent } from '../util';
import Callpanel from 'packages/callpanel';

describe('Callpanel', () => {
  afterEach(() => {
    const el = document.querySelector('.el-callpanel');
    if (!el) return;
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
    if (el.__vue__) {
      el.__vue__.$destroy();
    }
  });

  it('automatically close', done => {
    Callpanel({
      message: '玻璃蜡烛',
      duration: 500
    });
    expect(document.querySelector('.el-callpanel')).to.exist;
    setTimeout(() => {
      expect(document.querySelector('.el-callpanel')).to.not.exist;
      done();
    }, 1000);
  });

  it('manually close', done => {
    Callpanel({
      message: '苍白母马'
    });
    setTimeout(() => {
      document.querySelector('.el-callpanel__closeBtn').click();
      setTimeout(() => {
        expect(document.querySelector('.el-callpanel')).to.not.exist;
        done();
      }, 500);
    }, 500);
  });

  it('create', () => {
    Callpanel({
      title: '狮子',
      message: '狮鹫',
      duration: 0
    });
    const group = document.querySelector('.el-callpanel__group');
    const title = group.querySelector('.el-callpanel__title');
    const message = group.querySelector('.el-callpanel__content p');
    expect(document.querySelector('.el-callpanel')).to.exist;
    expect(title.textContent).to.equal('狮子');
    expect(message.textContent).to.equal('狮鹫');
  });

  it('html string as message', () => {
    Callpanel({
      title: '狮子',
      message: '<strong>狮鹫</strong>',
      dangerouslyUseHTMLString: true,
      duration: 0
    });
    const message = document.querySelector('.el-callpanel__content strong');
    expect(message.textContent).to.equal('狮鹫');
  });

  it('create by vnode', () => {
    const fakeVM = new Vue();
    const h = fakeVM.$createElement;

    Callpanel({
      message: h('p', { style: { color: 'red' } }, '大美兴，川普王')
    });
    const group = document.querySelector('.el-callpanel__group');
    const message = group.querySelector('.el-callpanel__content');

    expect(message.innerHTML).to.equal('<p style="color: red;">大美兴，川普王</p>');
  });

  it('alias by vnode', () => {
    const fakeVM = new Vue();
    const h = fakeVM.$createElement;

    Callpanel.error(h('p', { style: { color: 'green' } }, '+1s'));
    const group = document.querySelector('.el-callpanel__group');
    const message = group.querySelector('.el-callpanel__content');

    expect(message.innerHTML).to.equal('<p style="color: green;">+1s</p>');
  });

  it('invoke with type', () => {
    Callpanel.success('太阳之子');
    expect(document.querySelector('.el-callpanel').__vue__.type).to.equal('success');
  });

  it('reset timer', done => {
    Callpanel({
      message: '芳香总管',
      duration: 1000
    });
    setTimeout(() => {
      triggerEvent(document.querySelector('.el-callpanel'), 'mouseenter');
      setTimeout(() => {
        triggerEvent(document.querySelector('.el-callpanel'), 'mouseleave');
        expect(document.querySelector('.el-callpanel')).to.exist;
        done();
      }, 700);
    }, 500);
  });

  it('no close button', done => {
    Callpanel({
      message: 'Hello',
      showClose: false
    });
    setTimeout(() => {
      expect(document.querySelector('.el-callpanel__closeBtn')).to.not.exist;
      done();
    }, 500);
  });
});
