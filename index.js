const functions = require("@google-cloud/functions-framework");
const { Inngest } = require("inngest");
const { serve } = require("inngest/express");

const inngest = new Inngest({
  id: "gcp-sample",
  name: "GCP CloudFunction Example"
})

const hello = inngest.createFunction(
  { id: "hello-world", name: "Hello World" },
  { event: "test/hello" },
  async ({ step, event }) => {
     await step.run("datetime", () => {
      return event.data.datetime || null;
    })

    const greet = await step.run("say-hello", () => {
      return "hello"
    })

    return `${greet} world!`
  }
)

const minute = inngest.createFunction(
  { id: "every-minute", name: "Every Minute" },
  { cron: "* * * * *" },
  async ({ step }) => {
    const datetime = await step.run("current-datetime", () => Date.now())

    await step.sleep("30s", "30s")

    await step.sendEvent("hello", {
      name: "test/hello",
      data: { datetime: datetime }
    })

    return datetime
  }
)

const sleep = inngest.createFunction(
  { id: "sleeping", name: "Sleep a lot" },
  { event: "test/sleep" },
  async ({ step }) => {
    await step.sleep("sleep", "5m")
    return "done"
  }
)

functions.http(
  "inngest",
  serve({
    client: inngest,
    functions: [hello, minute, sleep]
  })
)
