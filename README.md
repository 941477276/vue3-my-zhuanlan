# Bootstrap Icon Vue
A free and open-source icon component library for Bootstrap icons based on `vue3`, all icons are from [Bootstrap official icon library](https://github.com/twbs/icons)

[中文文档](http://xxx.yyy)
## Install 
**npm**
`npm install bs-icon-vue -S`

**yarn**
`yarn add bs-icon-vue --save`

## Usage
```
<template>
  <BsiBootstrap />
  <BsiGithub />
</template>

<script setup>
  /* // It is not recommended to use this method to import, because there are thousands of icon components in the library, that is, thousands of modules, 
    // and webpack will load these thousands of modules during development, which will slow down the hot update speed of webpack
  // import { BsiBootstrap } from 'bs-icon-vue'; */
  import { BsiBootstrap } from 'bs-icon-vue/icons/BsiBootstrap';
  // The icon component name is the component file name
  import { BsiGithub } from 'bs-icon-vue/icons/BsiGithub';
</script>
```
[Documentation and Examples](http://xxx.com)

## Component props

| Parameter  | Illustrate                                      | Type         | Default value | Version |
|:-----------|:------------------------------------------------|:-------------|:--------------|:--------|
| width      | icon width                                            | stringnumber | 1em           | --      |
| height     | icon height                                            | stringnumber | 1em           | --      |
| fill       | Icon fill color                                          | string       | currentColor  | --      |
| viewBox    | The viewBox attribute of svg, read from svg by default, if it cannot be read, use "0 0 1024 1024" | string       | --            |
| ariaHidden | ariaHidden attribute value                                   | boolean      | true          | --      |
| focusable  | focusable attribute value                                    | boolean      | false         | --      |
