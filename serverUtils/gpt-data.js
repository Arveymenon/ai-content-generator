require('dotenv').config()

const bearerToken = process.env.OPEN_AI_KEY;

const basePath = `https://api.openai.com/`

const getBlogContent = (body) => {
  return `
    Generate an SEO-optimized blog for my company, ${body.content.company_name}, in the ${body.content.industry_name} industry.
      Parameters:
      - Blog Type: ${body.content.blog_type}
      - Blog Topic: ${body.content.topic}
      - Word Limit: 50
      - Format: Markdown
      
      Output Format:
      1. Blog Content
      2. Suggested Excerpt for the Blog
      3. Suggested Meta Tags for the Blog
      4. Suggested Meta Description for the Blog
      5. Focus Keyword Used in the Blog
      6. Suggested Categories for the Blog
  `
}

// Generate a minimalistic symbol for a company named ${body.content.company_name}, in the ${body.content.industry_name} industry. ${body.content.idea && "Use the idea of "+body.content.idea}. The symbol should be text-free. Ensure the design has no letters, words, or text elements.
const getLogoContent = (body) => {
  return `
  An professional abstract symbol of ${body.content.company_name} in the ${body.content.industry_name} industry.
  `
}

const getBlogData = async (req, response, content) => {
    console.log(response)
    return await fetch(basePath+"v1/chat/completions", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
        "Authorization" : "Bearer " + bearerToken,
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo-0613",
            "messages": [{"role": "user", "content": content}],
            "temperature": 0.7
        })
      }).then(async chatCompletionResponse => {
        let res = await chatCompletionResponse.json();
        response.send({"response": res.choices[0].message.content, "user": {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile
        }});
      }).catch((err)=>{
        response.send("error", err)
      })
}

const getLogoData = async (req, response, content) => {
    console.log(response)
    return await fetch(basePath+"v1/images/generations", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
        "Authorization" : "Bearer " + bearerToken,
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "prompt": content,
          "n": 1,
          "size": "1024x1024"
        })
      }).then(async chatCompletionResponse => {
        let res = await chatCompletionResponse.json();
        response.send({"response": res, "user": {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile
        }})
      }).catch((err)=>{
        response.send("error", err)
      })
}

module.exports = { getBlogData, getLogoData, getBlogContent, getLogoContent }
