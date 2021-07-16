import { readLines } from "https://deno.land/std/io/mod.ts";

const key = Deno.env.get("KEY");

if (key === undefined) {
  console.error("请在环境变量中设置 KEY");
  Deno.exit(1);
}

// 发送的内容
let content = Deno.args.join(" ");
if (Deno.args.length === 0) {
  console.log("请输入你想要发送的内容，按回车键结束：");
  for await (content of readLines(Deno.stdin)) {
    if (content !== "") break;
  }
}

/** 接口的返回类型 */
interface Result {
  /** 错误码，`0` 表示成功 */
  errcode: number;
  /** 错误描述 */
  errmsg: string;
}

const url = new URL("https://qyapi.weixin.qq.com/cgi-bin/webhook/send");
url.searchParams.append("key", key);

const response = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": " application/json" },
  body: JSON.stringify({
    msgtype: "markdown",
    markdown: { content },
  }),
});

if (!response.ok) {
  console.error(response.statusText);
  Deno.exit(1);
}

const body: Result = await response.json();

if (body.errcode !== 0) {
  console.error(body.errmsg);
  Deno.exit(1);
}

console.log("send success 👌");
