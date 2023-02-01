import{_ as e,c as t,a as n,e as l,w as p,b as s,d as o,r as c,o as r}from"./app.b44abc62.js";const j=JSON.parse('{"title":"vue2的双向数据绑定原理：","description":"","frontmatter":{},"headers":[{"level":2,"title":"核心：通过 Object.defineProperty进行对象劫持","slug":"核心-通过-object-defineproperty进行对象劫持","link":"#核心-通过-object-defineproperty进行对象劫持","children":[{"level":3,"title":"Object.defineProperty是如何监控对象属性的变化，并进行实时数据响应？","slug":"object-defineproperty是如何监控对象属性的变化-并进行实时数据响应","link":"#object-defineproperty是如何监控对象属性的变化-并进行实时数据响应","children":[]}]}],"relativePath":"vue/reactive2.md"}'),D={name:"vue/reactive2.md"},y=o('<h1 id="vue2的双向数据绑定原理" tabindex="-1">vue2的双向数据绑定原理： <a class="header-anchor" href="#vue2的双向数据绑定原理" aria-hidden="true">#</a></h1><hr><ul><li><a href="#vue2%E7%9A%84%E5%8F%8C%E5%90%91%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A%E5%8E%9F%E7%90%86">vue2的双向数据绑定原理：</a><ul><li><a href="#%E6%A0%B8%E5%BF%83%E9%80%9A%E8%BF%87-objectdefineproperty%E8%BF%9B%E8%A1%8C%E5%AF%B9%E8%B1%A1%E5%8A%AB%E6%8C%81">核心：通过 <code>Object.defineProperty</code>进行对象劫持</a><ul><li><a href="#objectdefineproperty%E6%98%AF%E5%A6%82%E4%BD%95%E7%9B%91%E6%8E%A7%E5%AF%B9%E8%B1%A1%E5%B1%9E%E6%80%A7%E7%9A%84%E5%8F%98%E5%8C%96%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%AE%9E%E6%97%B6%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94">Object.defineProperty是如何监控对象属性的变化，并进行实时数据响应？</a><ul><li><a href="#%E5%85%B8%E5%9E%8B%E5%AF%B9%E8%B1%A1%E5%88%86%E6%9E%90%E6%99%AE%E9%80%9A%E5%AF%B9%E8%B1%A1%E5%92%8C%E6%95%B0%E7%BB%84">典型对象分析：普通对象和数组</a><ul><li><a href="#1%E6%99%AE%E9%80%9A%E5%AF%B9%E8%B1%A1%E5%8A%AB%E6%8C%81">1.普通对象劫持</a></li><li><a href="#2%E6%95%B0%E7%BB%84%E7%9A%84%E5%8A%AB%E6%8C%81%E9%80%9A%E8%BF%87%E5%AF%B9%E6%95%B0%E7%BB%84%E5%8E%9F%E7%94%9F%E6%96%B9%E6%B3%95%E7%9A%84%E9%87%8D%E8%BD%BD%E5%AE%9E%E7%8E%B0">2.数组的劫持：通过对数组原生方法的重载实现</a></li></ul></li></ul></li></ul></li></ul></li></ul>',3),F={id:"核心-通过-object-defineproperty进行对象劫持",tabindex:"-1"},A=n("code",null,"Object.defineProperty",-1),C=n("a",{class:"header-anchor",href:"#核心-通过-object-defineproperty进行对象劫持","aria-hidden":"true"},"#",-1),i={id:"object-defineproperty是如何监控对象属性的变化-并进行实时数据响应",tabindex:"-1"},E=n("a",{class:"header-anchor",href:"#object-defineproperty是如何监控对象属性的变化-并进行实时数据响应","aria-hidden":"true"},"#",-1),d=o(`<hr><h4 id="典型对象分析-普通对象和数组" tabindex="-1">典型对象分析：普通对象和数组 <a class="header-anchor" href="#典型对象分析-普通对象和数组" aria-hidden="true">#</a></h4><hr><h5 id="_1-普通对象劫持" tabindex="-1">1.普通对象劫持 <a class="header-anchor" href="#_1-普通对象劫持" aria-hidden="true">#</a></h5><p><code>代码示例：</code></p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#89DDFF;">    </span><span style="color:#676E95;font-style:italic;">//两个dom</span></span>
<span class="line"><span style="color:#A6ACCD;">    Object</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">defineProperty:</span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">input</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">type</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">text</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">text1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;</span><span style="color:#F07178;">br</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"><span style="color:#A6ACCD;">    user.name:</span><span style="color:#89DDFF;">&lt;</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;"> </span><span style="color:#C792EA;">id</span><span style="color:#89DDFF;">=</span><span style="color:#89DDFF;">&quot;</span><span style="color:#C3E88D;">obj1</span><span style="color:#89DDFF;">&quot;</span><span style="color:#89DDFF;">&gt;&lt;/</span><span style="color:#F07178;">div</span><span style="color:#89DDFF;">&gt;&lt;</span><span style="color:#F07178;">br</span><span style="color:#89DDFF;">/&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    //js代码</span></span>
<span class="line"><span style="color:#A6ACCD;">    let user = </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        name: </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">defineProperty</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        age: </span><span style="color:#F78C6C;">18</span><span style="color:#89DDFF;">,</span></span>
<span class="line"><span style="color:#A6ACCD;">        obj: </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#F07178;">age</span><span style="color:#89DDFF;">:</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">23</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    let list = [1, 2]</span></span>
<span class="line"><span style="color:#A6ACCD;">    Object.keys(user).forEach(key =&gt; </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        let oldV </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> user[key]</span></span>
<span class="line"><span style="color:#A6ACCD;">        Object</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">defineProperty</span><span style="color:#A6ACCD;">(user</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> key</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#F07178;">get</span><span style="color:#89DDFF;">(){</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">%c 调用get</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">color: #ccc</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">获取</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">属性: </span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">oldV</span><span style="color:#89DDFF;">}\`</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">oldV</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#89DDFF;">},</span></span>
<span class="line"><span style="color:#A6ACCD;">            </span><span style="color:#F07178;">set</span><span style="color:#89DDFF;">(</span><span style="color:#A6ACCD;font-style:italic;">val</span><span style="color:#89DDFF;">){</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">%c 调用set</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">color: red</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#89DDFF;">\`</span><span style="color:#C3E88D;">修改</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">key</span><span style="color:#89DDFF;">}</span><span style="color:#C3E88D;">属性：</span><span style="color:#89DDFF;">\${</span><span style="color:#A6ACCD;">val</span><span style="color:#89DDFF;">}\`</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#A6ACCD;">text1</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">val</span><span style="color:#F07178;">  </span><span style="color:#676E95;font-style:italic;">//改变input</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#82AAFF;">changeDom1</span><span style="color:#F07178;">(</span><span style="color:#A6ACCD;">val</span><span style="color:#F07178;">)   </span><span style="color:#676E95;font-style:italic;">//改变dom</span></span>
<span class="line"><span style="color:#F07178;">                </span><span style="color:#A6ACCD;">oldV</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">val</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#A6ACCD;">        </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    //input输入数据改变</span></span>
<span class="line"><span style="color:#A6ACCD;">    text1.oninput = function(e) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        user</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">name </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> e</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">target</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">value;</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">    //dom数据改变</span></span>
<span class="line"><span style="color:#A6ACCD;">    function changeDom1(str) </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">        obj1</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">innerHTML </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> str</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"></span></code></pre></div><h5 id="_2-数组的劫持-通过对数组原生方法的重载实现" tabindex="-1">2.数组的劫持：通过对数组原生方法的重载实现 <a class="header-anchor" href="#_2-数组的劫持-通过对数组原生方法的重载实现" aria-hidden="true">#</a></h5><p><code>代码示例：</code></p><div class="language-javascript"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> list </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span><span style="color:#F78C6C;">1</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">2</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#C792EA;">let</span><span style="color:#A6ACCD;"> arr </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> [</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">push</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">pop</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">shift</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">unshift</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">splice</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">sort</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">reverse</span><span style="color:#89DDFF;">&#39;</span><span style="color:#A6ACCD;">]</span></span>
<span class="line"><span style="color:#A6ACCD;">arr</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">forEach</span><span style="color:#A6ACCD;">(</span><span style="color:#A6ACCD;font-style:italic;">method</span><span style="color:#A6ACCD;"> </span><span style="color:#C792EA;">=&gt;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#C792EA;">let</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">original</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">=</span><span style="color:#F07178;"> </span><span style="color:#FFCB6B;">Array</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">prototype</span><span style="color:#F07178;">[</span><span style="color:#A6ACCD;">method</span><span style="color:#F07178;">]</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#A6ACCD;">Object</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">defineProperty</span><span style="color:#F07178;">(</span><span style="color:#FFCB6B;">Array</span><span style="color:#89DDFF;">.</span><span style="color:#A6ACCD;">prototype</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">method</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">        value</span><span style="color:#89DDFF;">()</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">%c 调用数组方法</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">color: green</span><span style="color:#89DDFF;">&#39;</span><span style="color:#89DDFF;">,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">method</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">            </span><span style="color:#A6ACCD;">original</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">apply</span><span style="color:#F07178;">(</span><span style="color:#89DDFF;">this,</span><span style="color:#F07178;"> </span><span style="color:#A6ACCD;">arguments</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#F07178;">        </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span><span style="color:#F07178;">)</span></span>
<span class="line"><span style="color:#89DDFF;">}</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">list</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">pop</span><span style="color:#A6ACCD;">(</span><span style="color:#F78C6C;">9</span><span style="color:#A6ACCD;">)</span></span>
<span class="line"><span style="color:#676E95;font-style:italic;">// list.splice(0, 1)</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(list)</span></span>
<span class="line"></span></code></pre></div>`,9);function h(u,_,f,B,b,g){const a=c("font");return r(),t("div",null,[y,n("h2",F,[l(a,{color:"Magenta"},{default:p(()=>[s("核心")]),_:1}),s("：通过 "),A,s("进行对象劫持 "),C]),n("h3",i,[s("Object.defineProperty是"),l(a,{color:"green"},{default:p(()=>[s("如何监控对象属性的变化，并进行实时数据响应")]),_:1}),s("？ "),E]),d])}const m=e(D,[["render",h]]);export{j as __pageData,m as default};
