
> 注：当前项目为 Serverless Devs 应用，由于应用中会存在需要初始化才可运行的变量（例如应用部署地区、函数名等等），所以**不推荐**直接 Clone 本仓库到本地进行部署或直接复制 s.yaml 使用，**强烈推荐**通过 `s init ${模版名称}` 的方法或应用中心进行初始化，详情可参考[部署 & 体验](#部署--体验) 。

# fc-image-update-webhook 帮助文档
<p align="center" class="flex justify-center">
    <a href="https://www.serverless-devs.com" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-image-update-webhook&type=packageType">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-image-update-webhook" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-image-update-webhook&type=packageVersion">
  </a>
  <a href="http://www.devsapp.cn/details.html?name=fc-image-update-webhook" class="ml-1">
    <img src="http://editor.devsapp.cn/icon?package=fc-image-update-webhook&type=packageDownload">
  </a>
</p>

<description>

该模版会部署一个函数，部署成功后您将会得到一个 HTTP 地址。您可以将此地址配置在 ACR 的触发器中。当镜像推送到 ACR 时，这个函数将被触发，从而更新函数所使用的镜像。

</description>

<codeUrl>



</codeUrl>
<preview>



</preview>


## 前期准备

使用该项目，您需要有开通以下服务并拥有对应权限：

<service>
</service>

<remark>



</remark>

<disclaimers>



</disclaimers>

## 部署 & 体验

<appcenter>
   
- :fire: 通过 [Serverless 应用中心](https://fcnext.console.aliyun.com/applications/create?template=fc-image-update-webhook) ，
  [![Deploy with Severless Devs](https://img.alicdn.com/imgextra/i1/O1CN01w5RFbX1v45s8TIXPz_!!6000000006118-55-tps-95-28.svg)](https://fcnext.console.aliyun.com/applications/create?template=fc-image-update-webhook) 该应用。
   
</appcenter>
<deploy>
    
- 通过 [Serverless Devs Cli](https://www.serverless-devs.com/serverless-devs/install) 进行部署：
  - [安装 Serverless Devs Cli 开发者工具](https://www.serverless-devs.com/serverless-devs/install) ，并进行[授权信息配置](https://docs.serverless-devs.com/fc/config) ；
  - 初始化项目：`s init fc-image-update-webhook -d fc-image-update-webhook`
  - 进入项目，并进行项目部署：`cd fc-image-update-webhook && s deploy -y`
   
</deploy>

## 案例介绍

<appdetail id="flushContent">

该模版会部署一个函数，部署成功后您将会得到一个 HTTP 地址。您可以将此地址配置在 ACR 的触发器中。当镜像推送到 ACR 时，这个函数将被触发，从而更新函数所使用的镜像。

</appdetail>

## 使用文档

<usedetail id="flushContent">

1. 选择您需要自动更新镜像的函数所在的地域。
2. “函数列表”中请输入需要自动更新镜像的函数列表，以英文逗号分隔。提示：* 代表所有函数。
3. 找到部署出来的 image-update-hook 函数，在此函数的详情页中的“配置”，“触发器”中找到“公网访问地址”
4. 在容器镜像控制台中创建触发器，并输入上一步中找到的内网地址。
   ![config](https://img.alicdn.com/imgextra/i1/O1CN01vr16VV1IQkfp6H8Nv_!!6000000000888-0-tps-2806-1600.jpg)
5. 当您向此仓库推送镜像后，容器镜像服务会调用此应用。此应用会根据您配置的“函数列表”中过滤出正在使用此镜像仓库的函数，并使用新的镜像 Tag 更新函数。

</usedetail>

## 注意事项

<matters id="flushContent">
</matters>


<devgroup>


## 开发者社区

您如果有关于错误的反馈或者未来的期待，您可以在 [Serverless Devs repo Issues](https://github.com/serverless-devs/serverless-devs/issues) 中进行反馈和交流。如果您想要加入我们的讨论组或者了解 FC 组件的最新动态，您可以通过以下渠道进行：

<p align="center">  

| <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407298906_20211028074819117230.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407044136_20211028074404326599.png" width="130px" > | <img src="https://serverless-article-picture.oss-cn-hangzhou.aliyuncs.com/1635407252200_20211028074732517533.png" width="130px" > |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| <center>微信公众号：`serverless`</center>                                                                                         | <center>微信小助手：`xiaojiangwh`</center>                                                                                        | <center>钉钉交流群：`33947367`</center>                                                                                           |
</p>
</devgroup>
