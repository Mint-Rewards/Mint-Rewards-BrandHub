## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

## Domain vocabulary

Canonical reference: `Mint-Rewards-Backend/docs/VOCABULARY.md`.

A **Campaign** is a recycling *programme* ("what programme is this"), a **Deal**
is the consumer *incentive* ("what do I get"), a **Discount** is one *type* of
Deal (a price reduction), and a **coupon/promo code** is only the redemption
*mechanism*. Avoid "offer" and "promotion" as nouns for a Deal.

Known and deliberate: BrandHub's Campaign surfaces (`CampaignsTab`,
`CreateCampaignForm`, the Campaigns sub-tab under Promotions) describe a record
that is structurally a Discount-type Deal — it captures `campaignType`,
`budget`, `targetAudience`, discount % and codes, and no programme attributes.
That naming was left as-is by decision; do not rename it, and do not add new
consumer-incentive fields to it.

`maxUses` on a Deal is server-derived from the code count — never send it from
the client.
