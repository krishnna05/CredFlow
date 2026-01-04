const Invoice = require("../models/Invoice");
const Business = require("../models/Business");

exports.getAnalyticsOverview = async (req, res) => {
  try {
    const defaultStats = {
      avgRiskScore: 100,
      riskTrend: 0,
      highRiskCount: 0,
      highRiskChange: "0",
      volume: 0,
      creditGrade: "A",
      trendData: [], 
      alerts: [],
      recommendations: [
        "Complete your business profile to start tracking.",
        "Upload your first invoice to generate risk insights."
      ]
    };

    const business = await Business.findOne({ userId: req.user.userId });
    
    if (!business) {
        return res.status(200).json(defaultStats);
    }

    const stats = await Invoice.aggregate([
      { $match: { businessId: business._id } },
      {
        $group: {
          _id: null,
          totalVolume: { $sum: "$invoiceAmount" },
          avgScore: { $avg: "$creditScore" },
          highRiskCount: { 
            $sum: { $cond: [{ $eq: ["$riskLevel", "HIGH"] }, 1, 0] } 
          }
        }
      }
    ]);

    if (stats.length === 0) {
        return res.status(200).json(defaultStats);
    }

    const data = stats[0];

    const recentInvoices = await Invoice.find({ businessId: business._id })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('createdAt creditScore');

    const trendData = recentInvoices.map(inv => ({
      date: new Date(inv.createdAt).toISOString().split('T')[0],
      score: inv.creditScore || 0
    })).reverse();

    res.status(200).json({
      avgRiskScore: Math.round(data.avgScore) || 0,
      riskTrend: 0,
      highRiskCount: data.highRiskCount,
      highRiskChange: "0",
      volume: data.totalVolume,
      creditGrade: data.avgScore >= 80 ? 'A' : data.avgScore >= 60 ? 'B' : 'C',
      trendData: trendData,
      alerts: data.highRiskCount > 0 ? [{ message: `${data.highRiskCount} High Risk Invoices detected.` }] : [],
      recommendations: [
        "Monitor your dashboard for real-time updates.",
        "Maintain a low high-risk invoice count."
      ]
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};