---
title: 如何跟踪仓库子目录之 subtree 命令
tags:
  - git
categories: tech
date: 2016-07-20 13:35:03
---


想翻译 react 的网站，然后发现 github 仓库中，有关网站部分的源码放在子目录 `/docs` 下，于是想能否单独 `folk` 子目录 `/docs`，而且以后只 `pull` 这个子目录的更新，于是提交记录就只有该目录下的，我就能专心对比提交然后修改对应翻译。

<!--more-->

通过阅读下列资源

- [Forking a sub directory ... part of my own repo](http://stackoverflow.com/questions/24577084/forking-a-sub-directory-of-a-repository-on-github-and-making-it-part-of-my-own-r)
- [Using Git subtrees to split a repository](https://lostechies.com/johnteague/2014/04/04/using-git-subtrees-to-split-a-repository/)
- [git-subtree/git-subtree.txt](https://github.com/apenwarr/git-subtree/blob/master/git-subtree.txt)

找到一种奇葩解决方法，下面逐步讲解

假设 `react` 仓库长这样

```
react.git (master)
	|---/others
	|---/docs
			|-- a.txt
			|-- b.txt
				
```

我希望我的仓库长这样：

```
my.git (master)
	|---/docs
			|-- a.txt
			|-- b.txt
			
	|---/docs-cn
			|-- a.txt
			|-- b.txt
```
其中 `/docs` 保持跟 react 的 `/docs` 内容一样，而 `/docs-cn` 则是我翻译新增的内容

## 步骤

### 1. 准备我的仓库

```
git clone git@github.com:zhenyong/react-website-cn.git

cd react-website-cn
```

### 2. 拉取 react master 分支

```
git remote add react https://github.com/facebook/react.git

git fetch react master:react-master
```

自动创建的本地 `react-master` 分支就相当于 react 库（master分支）

### 3. 分割子目录成新分支

```
git checkout react-master
git subtree split --prefix=docs -b react-docs
git checkout react-docs
git push origin react-docs
```
新的分支 `react-docs` 包含了 `/docs` 目录的所有内容，长这样

```
my.git (react-docs)
		|-- a.txt
		|-- b.txt
```

### 4. 子目录指向 `react-docs` 分支

```
git checkout master
git subtree add --prefix=docs --squash origin react-docs
```

在当前分支创建 `app` 目录，引用 origin react-docs 分支，可以理解成子目录作为一个子仓库，实际上 `react-docs` 的角色就是中转站

此时，我的 master 分支长这样

```
my.git (master)
	|---/docs
			|-- a.txt
			|-- b.txt
```

之后就可以在 master 增加翻译内容

### 5. 更新 `react-docs`

当 react 内容有更新后，拉取 react 最新内容，重新分割

```
git checkout react-master
git pull react master

git subtree split --prefix=docs --squash \
 --onto react-docs -b react-docs
 
 git checkout react-docs
 git push origin react-docs
```

注意 split 多了一个参数 --onto, 表明再次生成分支时基于原来 `react-docs` （HEAD）提交记录形成历史纪录

### 6. 我的 master 更新子仓库

```
git checkout master
git subtree pull --prefix=docs --squash origin react-docs
```

## 总结

通过 `react` 仓库分离子目录成为新的（中转）仓库，在我的仓库下建立子目录作为子仓库指向中转仓库，从而达到我的 `/docs` 目录跟踪 `react` 的 
`\docs` 目录。

note: 为了演示命令，所以没有设置分支跟踪来简化命令。另外你也可以考虑先 clone react 仓库然后再操作。



