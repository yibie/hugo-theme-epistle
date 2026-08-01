# Task List — Wanglai / 往来

task001 [x] 场景:维护者进入 Wanglai 实施阶段时有已确认的产品与实施边界 | Given:PR/FAQ 已定稿+用户接受 Git revert 唯一撤回机制 | When:用户确认进入实施阶段 | Then:Spec/Plan 标记 Approved+任务按可验证纵切拆分 | 验证:文档审阅

task002 [x] 场景:维护者获得可独立版本化的 Wanglai 公共源码仓库 | Given:现有 Epistle 实现已验证+相关代码提交均归属 yibie | When:初始化独立 monorepo 并冻结 v1 marker/批准内容契约 | Then:MIT 授权+无站点私有配置+新 marker 为 wanglai:v1+发布器兼容旧 epistle marker | 验证:仓库结构检查+契约单元测试+Secret 扫描

task003 [x] 场景:匿名访客从任意已配置 Hugo 站点安全寄出私人来信 | Given:Worker 配置精确来源+Turnstile+私人 inbox | When:提交合法或恶意表单 | Then:合法请求进入确认私有的 GitHub Issues+非法来源/字段/token/公开 inbox 被拒绝+客户端只收到通用错误 | 验证:Worker 单元测试+请求大小/CORS/Turnstile/replay/私有仓库边界测试

task004 [x] 场景:作者在独立私人 inbox 中批准来信后自动发布到另一 Hugo 源码仓库 | Given:Issue 含合法 marker+可选首条可信 `/reply`+目标仓库 deploy key | When:添加 `publish` 标签 | Then:仅一条净化 Markdown 由独立提交直推目标默认分支+提交链接回写 Issue+重复执行不重复发布 | 验证:发布器测试+workflow 契约测试+本地端到端 fixture

task005 [x] 场景:任意 Hugo 主题可以在文章末端显示并接收该文往来 | Given:站点通过 Hugo Module 引入 Wanglai+配置 endpoint/site key | When:主题调用中性 partial | Then:只展示 source_path 匹配内容+空状态直接展示表单+字段与状态可访问+多文章表单 ID/Turnstile 实例不冲突 | 验证:Hugo fixture 构建+产物断言+桌面/移动端浏览器检查

task006 [x] 场景:作者可以安全撤回一条误公开往来且保留审计记录 | Given:Issue 回链到单条发布提交+本地 Hugo 源码工作区干净 | When:运行撤回脚本并传入发布提交 | Then:脚本只接受 Wanglai 单文件发布提交+执行 Git revert 并 push+错误目标/脏工作区/冲突时停止 | 验证:临时 Git 仓库自动化测试

task007 [x] 场景:Hugo 作者按文档可以完成安装、审核、升级和排错 | Given:GitHub+Cloudflare 授权可用 | When:按 README 创建私人 inbox、deploy key、Worker 与 Hugo Module | Then:约 20 分钟内完成测试来信+所有 Secrets/Vars/权限/限制和撤回路径有明确说明 | 验证:文档走查+链接/命令检查+依赖审计

task008 [x] 场景:维护者发布首个可固定版本的 Wanglai 版本 | Given:task002-task007 完成+测试与安全审查通过 | When:创建公共 GitHub 仓库、推送 main 并发布语义化版本 | Then:源码可访问+CI 通过+release/tag 可固定使用+不包含私人数据或密钥 | 验证:GitHub Actions+release 页面+全量测试+Secret 扫描
