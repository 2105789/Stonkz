export default defineEventHandler(async (event) => {
  // This is sample data - in a real application, you would fetch this from your database
  return [
    {
      id: "INFY",
      name: "Infosys Ltd",
      model_based_signal: {
        confidence_score: 85,
        recommendation: "BUY",
        supporting_evidence: [
          "Strong fundamental performance with consistently growing revenue and profits.",
          "Recent product launches and strategic partnerships have strengthened market position.",
          "Analyst consensus shows strong buy recommendations with high price targets.",
          "Technical indicators suggest a positive momentum breakout with strong volume support.",
          "Sector outlook is highly favorable with increased IT spending projected globally."
        ]
      }
    },
    {
      id: "RELIANCE",
      name: "Reliance Industries Ltd",
      model_based_signal: {
        confidence_score: 76,
        recommendation: "BUY",
        supporting_evidence: [
          "Diversified business model provides stability and multiple growth avenues.",
          "Expansion in retail and digital sectors showing strong revenue potential.",
          "Technical pattern shows accumulation phase with increasing institutional interest.",
          "Strong balance sheet with significant cash reserves for future acquisitions.",
          "Projected to benefit from energy transition trends in coming years."
        ]
      }
    },
    {
      id: "HDFCBANK",
      name: "HDFC Bank Ltd",
      model_based_signal: {
        confidence_score: 45,
        recommendation: "HOLD",
        supporting_evidence: [
          "Strong fundamental performance (profit growth, debt-free status) supports long-term value.",
          "Positive company-specific news (earnings, new facility, partnerships) indicates business momentum.",
          "Analyst consensus is Hold with significant upside potential in price targets.",
          "Cautious overall market sentiment and recent price weakness suggest near-term risks.",
          "Mixed technical signals and inconsistent model predictions add to near-term uncertainty."
        ]
      }
    },
    {
      id: "TCS",
      name: "Tata Consultancy Services Ltd",
      model_based_signal: {
        confidence_score: 42,
        recommendation: "HOLD",
        supporting_evidence: [
          "Stable business model with predictable revenue streams from long-term contracts.",
          "Recent earnings inline with expectations but guidance was slightly cautious.",
          "Current valuation appears fair based on growth projections and sectoral comparisons.",
          "Technical indicators suggest a period of consolidation after recent rally.",
          "Increasing competition in core markets might pressure margins in coming quarters."
        ]
      }
    },
    {
      id: "TATAMOTORS",
      name: "Tata Motors Ltd",
      model_based_signal: {
        confidence_score: 38,
        recommendation: "HOLD",
        supporting_evidence: [
          "Mixed quarterly results with domestic business outperforming international segments.",
          "Supply chain challenges continue to impact production capabilities.",
          "Significant debt reduction progress is positive for long-term health.",
          "Stock price has already factored in near-term positive catalysts.",
          "Competitive pressures in EV segment may impact future market share."
        ]
      }
    },
    {
      id: "SBIN",
      name: "State Bank of India",
      model_based_signal: {
        confidence_score: 68,
        recommendation: "BUY",
        supporting_evidence: [
          "Impressive asset quality improvement with reducing NPAs quarter over quarter.",
          "Strong deposit growth and improving credit offtake indicate business momentum.",
          "Attractive valuation compared to private sector peers despite similar growth metrics.",
          "Technical patterns suggest accumulation by institutional investors at current levels.",
          "Expected to benefit significantly from the economic recovery and credit growth cycle."
        ]
      }
    },
    {
      id: "AXISBANK",
      name: "Axis Bank Ltd",
      model_based_signal: {
        confidence_score: 74,
        recommendation: "BUY",
        supporting_evidence: [
          "Digital transformation initiatives driving operational efficiency and customer acquisition.",
          "Steady improvement in asset quality metrics with reducing credit costs.",
          "Technical chart shows strong support levels with increasing trading volumes.",
          "Retail lending segment showing robust growth and improved market share.",
          "Attractive valuation metrics compared to historical averages and sector peers."
        ]
      }
    },
    {
      id: "YESBANK",
      name: "Yes Bank Ltd",
      model_based_signal: {
        confidence_score: 82,
        recommendation: "SELL",
        supporting_evidence: [
          "Continued balance sheet challenges with high level of stressed assets.",
          "Significant dilution risk for existing shareholders with potential capital raising.",
          "Technical chart shows persistent distribution pattern with weakening support levels.",
          "Recovery timeline appears extended with numerous execution challenges ahead.",
          "Competitive position has weakened substantially with limited customer acquisition."
        ]
      }
    },
    {
      id: "ZOMATO",
      name: "Zomato Ltd",
      model_based_signal: {
        confidence_score: 78,
        recommendation: "SELL",
        supporting_evidence: [
          "Valuation appears stretched relative to current profitability metrics and projected path to breakeven.",
          "Increasing competition in food delivery space with heavy discounting pressuring margins.",
          "Technical indicators suggest distribution phase with weakening momentum.",
          "Insider selling pattern indicates limited confidence in near-term appreciation.",
          "Customer acquisition costs rising with diminishing returns on marketing spend."
        ]
      }
    },
    {
      id: "VEDL",
      name: "Vedanta Ltd",
      model_based_signal: {
        confidence_score: 62,
        recommendation: "SELL",
        supporting_evidence: [
          "Global commodity price pressures likely to impact profitability in coming quarters.",
          "Group debt concerns create uncertainty around capital allocation and dividends.",
          "Technical chart shows breakdown of key support levels with increasing selling pressure.",
          "Regulatory challenges in key operating regions pose execution risks.",
          "ESG concerns may limit institutional investment appetite despite attractive valuation."
        ]
      }
    }
  ];
}); 