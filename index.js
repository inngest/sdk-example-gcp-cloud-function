const functions = require("@google-cloud/functions-framework");
const { Inngest } = require("inngest");
const { serve } = require("inngest/express");

const inngest = new Inngest({ id: "gcp-sample", name: "GCP CloudFunction Example" })

const hello = inngest.createFunction(
  { id: "hello-world", name: "Hello World" },
  { event: "test/hello" },
  async ({ step }) => {
    const greet = await step.run("say-hello", () => {
      return "hello"
    })

    return `${greet} world!`
  }
)

functions.http(
  "inngest",
  serve({
    client: inngest,
    functions: [hello]
  })
)
