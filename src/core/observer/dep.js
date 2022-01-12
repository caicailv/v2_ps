/* @flow */

import type Watcher from "./watcher";
import { remove } from "../util/index";

let uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 * *dep是一个可观察的，可以有多个
 * 订阅它的指令。
 */
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher) {
    remove(this.subs, sub);
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  }
  // 这个函数的作用是通知渲染watcher重新渲染
  notify() {
    // stabilize the subscriber list first
    // 首先稳定订户列表
    const subs = this.subs.slice();
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
//正在评估的当前目标监视程序。
//这是全球唯一的，因为可能只有一个
//随时评估观察者。
Dep.target = null;
const targetStack = [];

export function pushTarget(_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target);
  Dep.target = _target;
}

export function popTarget() {
  Dep.target = targetStack.pop();
}
