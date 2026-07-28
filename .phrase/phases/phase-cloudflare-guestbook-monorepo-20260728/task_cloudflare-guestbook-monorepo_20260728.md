# Task List — Phase: cloudflare-guestbook-monorepo-20260728

task001 [x] 场景:维护者开始留言板新阶段时有一份锁定边界的产品与技术事实来源 | Given:用户已确认 monorepo+Cloudflare 固定+Hugo 首版 | When:进入实现前 | Then:PR/FAQ+spec+plan+tech-refer 明确目标、非目标、隐私和验收标准 | 验证:文档审阅

task002 [x] 场景:维护者在不破坏现有 Hugo theme 用法的前提下运行 monorepo 工具链 | Given:主题约定目录仍位于仓库根 | When:安装依赖并执行根测试命令 | Then:Worker 与发布器 workspace 可独立测试+现有 Hugo 构建路径不变 | 验证:`npm install`+`npm test`+Hugo exampleSite 构建

task003 [x] 场景:匿名访客安全投递一封私人来信 | Given:Worker 配置允许来源+Turnstile+私人 inbox 仓库 | When:提交合法表单 | Then:Worker 服务端验证请求并创建带唯一 ID 的结构化私人 Issue+客户端获得成功反馈 | 验证:Worker 单元测试+本地集成测试

task004 [x] 场景:恶意或无效请求无法进入私人收件箱 | Given:请求来源非法/验证码无效/字段越界/GitHub API 失败 | When:提交表单 | Then:Worker 拒绝或返回通用失败+不创建 Issue+不泄露 Secret 或私人字段 | 验证:边界测试+日志审阅

task005 [x] 场景:站长批准一封已回复且获许可的来信后得到 Hugo 内容变更 | Given:私人 Issue 含合法 v1 数据+公开许可+公开版回信 | When:添加 `publish` 标签 | Then:Action 调用 Hugo 发布器生成确定性 Markdown PR/变更且不含邮箱+匿名正文只进入 front matter | 验证:发布器测试+workflow fixture dry run

task006 [x] 场景:误批准的私人、不完整或恶意来信不会泄密或执行代码 | Given:Issue 未同意公开/无回信/schema 无效/含 raw HTML 或 shortcode/已发布 | When:添加 `publish` 标签或构建 Hugo | Then:工作流拒绝不完整数据+公开模板只显示恶意片段文本+不生成重复内容 | 验证:发布器负向测试+Hugo 产物断言

task007 [x] 场景:Hugo 站长启用留言板后读者可以投递并浏览已公开往来 | Given:站点配置 Worker endpoint 与 Turnstile site key | When:访问留言板、提交表单或打开公开往来 | Then:表单有可访问状态反馈+列表/详情正确展示+邮箱永不渲染 | 验证:exampleSite 构建+浏览器手动验收

task008 [x] 场景:维护者按文档可以配置、部署、排错和回滚系统 | Given:拥有 Cloudflare zone 与 GitHub 仓库 | When:阅读 README 并执行部署步骤 | Then:知道 Secrets/权限/通知/标签/发布/回滚方式 | 验证:文档审阅+无 Secret 扫描

task009 [x] 场景:维护者确认首版可发布且现有主题无回归 | Given:所有实现任务完成 | When:运行测试、静态检查、Hugo 构建与端到端 fixture | Then:全部通过+phase change 索引完整+剩余风险已记录 | 验证:命令输出与变更审阅
