/* Brewling product-page content.
 * Source: supplied product PRDs and existing copy deck.
 * Product scope, enquiry context and human decision boundaries.
 */
window.BREWLING_ENHANCEMENTS = {
  databrew: {
    ctaLabel: "Request a briefing",
    enquiryIntent: "Discuss your organisation’s knowledge workflows, information boundaries and hosting requirements for Databrew.",
    aiAssists: "Find authorised information, prepare source-linked responses and draft follow-up work.",
    humanDecides: "Set access and action boundaries, review the result and approve consequential external actions.",
    evidenceTitle: "See the work behind the answer.",
    evidenceIntro: "Databrew is designed to connect an answer to its sources and the activity that produced it, giving reviewers a clear record to inspect.",
    evidenceItems: [
      "Source references and citations behind the response.",
      "The agent’s plan, tool activity and completion state.",
      "Policy checks, approvals and a record of authorised actions."
    ],
    faqs: [
      {
        question: "Who is Databrew designed for?",
        answer: "Enterprises, public institutions and regulated organisations with complex information needs. The workspace can be shaped around sector vocabulary, roles and defined workflows."
      },
      {
        question: "How are information boundaries scoped?",
        answer: "Start with your identity systems, user roles and source permissions. Discuss the information each role may access and the approval rules for consequential actions."
      },
      {
        question: "What hosting requirements can we discuss?",
        answer: "Tell us about your hosting, data residency, network isolation and infrastructure requirements. We’ll review the fit for your organisation’s environment."
      },
      {
        question: "Does Databrew replace our existing business systems?",
        answer: "No. Databrew helps people use organisational knowledge and carry out bounded AI work. Existing business systems remain the records of authority for the work they own."
      }
    ]
  },
  dealbrew: {
    ctaLabel: "Book a walkthrough",
    enquiryIntent: "Explore a Dealbrew walkthrough and discuss the parties, agreements and milestones involved in your commercial transactions.",
    aiAssists: "Summarise agreements with sources, compare versions and suggest obligations, milestones and follow-up work.",
    humanDecides: "Approve terms, sign agreements, authorise releases or refunds and determine dispute outcomes through the agreed process.",
    evidenceTitle: "Keep the complete transaction story.",
    evidenceIntro: "The closing pack is designed to bring the agreement, performance and settlement evidence together, so the transaction can be understood after it ends.",
    evidenceItems: [
      "Counterparty and authority evidence, agreement versions and signing records.",
      "Milestone submissions, acceptance decisions and approved changes.",
      "Partner money references, dispute outcomes and the transaction history."
    ],
    faqs: [
      {
        question: "Is Dealbrew a sales CRM?",
        answer: "No. Dealbrew focuses on commercial commitments, from counterparty review and agreements to performance and settlement. Sales pipelines and general customer relationship management sit outside that focus."
      },
      {
        question: "Does Dealbrew hold our money?",
        answer: "No. Funds must be held and moved by the appropriate banking or payment partners. Discuss the partner arrangements, transaction terms and release controls your organisation requires."
      },
      {
        question: "Does the transaction end when an agreement is signed?",
        answer: "No. Dealbrew’s scope continues through milestones, delivery evidence, acceptance, payment conditions, exceptions and the final closing record."
      },
      {
        question: "Can AI sign or release money for us?",
        answer: "No. AI can prepare explanations and suggestions. Signatures, authority changes, payments, refunds and dispute decisions require authorised people and the appropriate controls."
      }
    ]
  },
  hirebrew: {
    ctaLabel: "Book a walkthrough",
    enquiryIntent: "Discuss your hiring, onboarding and employee-service workflows in a Hirebrew walkthrough.",
    aiAssists: "Draft roles, explain candidate-match suggestions, prepare interview material and summarise routine people workflows.",
    humanDecides: "Make hiring, promotion, pay, disciplinary and exit decisions, with the reasoning and supporting context recorded.",
    evidenceTitle: "Keep the context behind people decisions.",
    evidenceIntro: "Hirebrew is designed to retain the conversations, inputs and decisions behind a candidate or employee journey, with access appropriate to each role.",
    evidenceItems: [
      "Candidate stages, structured scorecards and the final decision rationale.",
      "AI suggestions, reviewer corrections and the accountable human decision.",
      "Employee requests, approvals, replies and resolution history."
    ],
    faqs: [
      {
        question: "Is Hirebrew only for recruitment?",
        answer: "No. Its scope spans the people lifecycle, including onboarding, employee services, manager workflows, performance, learning and workforce insight."
      },
      {
        question: "Does Hirebrew replace our payroll engine?",
        answer: "No. Your payroll engine remains responsible for payroll calculations and execution. Discuss how payroll-related records and workflows fit your people operations."
      },
      {
        question: "Is Hirebrew a public jobs marketplace?",
        answer: "No. It is designed for organisations managing their own hiring and people operations. A candidate experience supports that organisation’s recruitment process."
      },
      {
        question: "Does AI choose who gets hired?",
        answer: "No. AI can assist preparation and review, with supporting context and a correction path. People remain responsible for employment decisions."
      }
    ]
  },
  ledgerbrew: {
    ctaLabel: "Discuss your requirements",
    enquiryIntent: "Discuss your invoice, collection and reconciliation workflows, accounting system and finance controls.",
    aiAssists: "Extract invoice fields with source references, suggest bank matches and draft collection reminders.",
    humanDecides: "Release payments, approve tax rules, resolve exceptions and authorise customer escalations.",
    evidenceTitle: "Bring the period’s evidence together.",
    evidenceIntro: "The period evidence pack is designed to connect an invoice to its approvals, tax evidence, payment, bank match and accounting entry.",
    evidenceItems: [
      "Source invoices, review decisions and e-invoice clearance responses.",
      "Payment events, receipt matches and reconciliation decisions.",
      "Balanced journal batches, posting receipts and the approval trail."
    ],
    faqs: [
      {
        question: "Is Ledgerbrew a general ledger?",
        answer: "No. It is designed to operate above the customer’s existing general ledger, handling invoice, approval, collection and reconciliation workflows and preparing the resulting journals."
      },
      {
        question: "How should we scope e-invoicing requirements?",
        answer: "Discuss the applicable invoicing rules, clearance requirements and accredited partner arrangements for your organisation. Assess these alongside your accounting and approval workflows."
      },
      {
        question: "Does Ledgerbrew file our tax returns?",
        answer: "No. Ledgerbrew’s focus is schedules, source evidence and review. Your organisation remains responsible for its tax positions and filings."
      },
      {
        question: "Does Ledgerbrew hold or move funds itself?",
        answer: "It does not hold client funds. Payment execution belongs with licensed banks or payment partners; Ledgerbrew’s focus is approval, preparation and reconciliation."
      }
    ]
  },
  propbrew: {
    ctaLabel: "Book a walkthrough",
    enquiryIntent: "Discuss the estates, facilities and resident-service workflows your property team manages.",
    aiAssists: "Triage resident requests, suggest maintenance actions, find documents and draft communications.",
    humanDecides: "Approve schedule changes, financial adjustments, permissions, security actions and outbound messages.",
    evidenceTitle: "Keep a useful history of estate operations.",
    evidenceIntro: "Propbrew is designed to keep requests, field evidence and financial decisions tied to the estate, asset, resident or vendor involved.",
    evidenceItems: [
      "Work-order ownership, field evidence and completion verification.",
      "Invoice references, verified payment events and reconciliation approvals.",
      "State changes, communications decisions and AI review history."
    ],
    faqs: [
      {
        question: "Is Propbrew a property listing marketplace?",
        answer: "No. Its main job is running estates and property operations: facilities, resident services, billing, collections and the daily work of the operator."
      },
      {
        question: "How do we scope field access?",
        answer: "Tell us which devices your field teams use, where connectivity is limited and what needs to happen without a connection. We’ll review those needs alongside evidence capture, updates and access controls."
      },
      {
        question: "What should we cover in a Propbrew walkthrough?",
        answer: "Bring a typical resident request, maintenance process or collections workflow. We’ll discuss who owns each step and which records, approvals and systems your team needs."
      },
      {
        question: "Does Propbrew include deep construction management?",
        answer: "Propbrew focuses on estate and facility operations. Construction project delivery has different requirements and should be scoped separately."
      }
    ]
  }
};
