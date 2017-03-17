import Vue from 'vue';
import Container from './Container';

const div = document.createElement('div');
document.body.appendChild(div);

const viewport = document.createElement('meta');
viewport.setAttribute('name', 'viewport');
viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');

const httpEquiv = document.createElement('meta');
httpEquiv.setAttribute('tttp-equiv', 'X-UA-Compatible');
httpEquiv.setAttribute('content', 'ie=edge');

[viewport, httpEquiv].forEach(el => document.head.appendChild(el));

new Vue(Container).$mount(div);
