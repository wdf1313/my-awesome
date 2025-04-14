# git 🚧

结合实际开发中遇到的场景问题，介绍各种命令的使用


## git 各个工作区

- 工作区 Working Directory：电脑上实际的文件

- 暂存区 Staging Area/Index：通过 `git add` 命令将文件从工作区添加到暂存区。记录了下次提交时要保存的文件更改

- 本地仓库 Local Repository：通过 `git commit` 命令将暂存区的内容提交到本地仓库，包含了项目所有历史记录和分支信息，有完整的版本控制。

- 远程仓库 Remote Repository：位于远程服务器上（如 GitLab、GitHub），通过 `git push` 将本地仓库的内容推送到远程仓库。通过 `git pull` 将远程仓库的内容拉取到本地。

## 修改最新提交 message

`git commit --amend` 打开 vim 编译器，修改提交信息。

`git commit --amend -m '新的提交信息'` 在命令行中修改，不打开编辑器。

## 临时保存修改

`git stash` 临时保存工作目录和暂存区的修改。

比如在当前分支有未提交修改，但是需要切换到其他分支时。需要暂时搁置当前工作去处理。

| 命令                        | 作用                                      |
| --------------------------- | ----------------------------------------- |
| git stash \ git stash push  | 存储当前修改                              |
| git stash -u                | 存储并包含未跟踪的文件                    |
| git stash list              | 查看存储列表                              |
| git stash pop               | 应用最近一次保存的 stash 并将其从栈中删除 |
| git stash pop <stash 编号>  | 应用指定的 stash 并将其从栈中删除         |
| git stash drop              | 删除最近一次保存的 stash                  |
| git stash drop <stash 编号> | 删除指定的 stash                          |
| git stash clear             | 删除栈中所有的 stash                      |
| git stash clear             | 删除栈中所有的 stash                      |
| git stash show              | 查看最近一次 stash 差异                   |
| git stash show <stash 编号> | 查看指定 stash 差异                       |

## 撤销上一次提交记录

### 撤销提交但保留所有更改在工作目录中

```bash
git reset --soft HEAD~1
```

这个命令的作用是将 HEAD 指针回退到上一个提交，但保留工作区和暂存区。本地分支会比远程落后一个分支。

如果需要推送到远程，需要使用 `git push --force` 强制推送，可能会影响其它协作者。

### 反向提交（用于已推送的提交）

如果提交已经推送到远程分支，最好创建一个反向提交。这会创建一个新的提交，撤销前一个提交的更改，而不会重写历史记录。

```bash
git revert HEAD
```

## 推荐学习资源

官方文档：[Git Book](https://git-scm.com/book/en/v2)  
可视化工具：[Learn Gut Branching](https://learngitbranching.js.org/?locale=zh_CN)  
提交规范: [Conventional Commits](https://www.conventionalcommits.org/)
