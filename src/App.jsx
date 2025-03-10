import React, { useState } from 'react';

function App() {
  const [amlType, setAmlType] = useState('');
  const [subtype, setSubtype] = useState('');
  const [timePoint, setTimePoint] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);

  // Define risk categories (from Image 1)
  const subtypeOptions = {
    favorable: [
      { value: 'NPM1mut_wo_FLT3ITD', label: 'NPM1mut w/o FLT3-ITD' },
      { value: 'RUNX1_RUNX1T1', label: 'RUNX1::RUNX1T1' },
      { value: 'CBFB_MYH11', label: 'CBFB::MYH11' },
      { value: 'PML_RARA', label: 'PML::RARA' },
      { value: 'CEBPA_bZIP', label: 'CEBPA bZIP in-frame' }
    ],
    intermediate: [
      { value: 'FLT3ITD_NPM1wt', label: 'FLT3-ITD and NPM1wt' },
      { value: 'FLT3ITD_NPM1mut', label: 'FLT3-ITD and NPM1mut' },
      { value: 'KMT2A_MLLT3', label: 'KMT2A::MLLT3, other fusion genes¹' },
      { value: 'Other_int', label: 'Other' }
    ],
    adverse: [
      { value: 'Fusion_KMT2A', label: 'Fusion genes (e.g., KMT2A::r)' },
      { value: 'Other_adv', label: 'Other' }
    ]
  };

  // Time points for each subtype (from Image 1)
  const timePointOptions = {
    // Common time points
    baseline: { label: 'Baseline' },
    cycles_2: { label: 'After 2 cycles of IC / Pre-HSCT' },
    eot: { label: 'End of treatment' },
    follow_up: { label: 'Follow-up' },
    pre_hct: { label: 'Pre-alloHCT' }
  };

  // Specific time points per subtype (from Image 1)
  const subtypeTimePoints = {
    NPM1mut_wo_FLT3ITD: ['cycles_2', 'eot', 'follow_up'],
    RUNX1_RUNX1T1: ['baseline', 'cycles_2', 'eot', 'follow_up'],
    CBFB_MYH11: ['baseline', 'cycles_2', 'eot', 'follow_up'],
    PML_RARA: ['eot', 'follow_up'],
    CEBPA_bZIP: ['baseline', 'cycles_2', 'eot', 'follow_up'],
    FLT3ITD_NPM1wt: ['cycles_2', 'eot', 'follow_up'],
    FLT3ITD_NPM1mut: ['cycles_2', 'eot', 'follow_up'],
    KMT2A_MLLT3: ['cycles_2', 'eot'],
    Fusion_KMT2A: ['cycles_2', 'eot'],
    Other_int: ['baseline', 'cycles_2', 'eot', 'follow_up'],
    Other_adv: ['baseline', 'cycles_2', 'eot', 'follow_up']
  };

  // Map subtype to monitoring table (from Images 2-7)
  // For multiple assays, provide an array of tables in order of display
  const subtypeToTable = {
    NPM1mut_wo_FLT3ITD: 'NPM1',
    RUNX1_RUNX1T1: 'CBF',
    CBFB_MYH11: 'CBF',
    PML_RARA: 'PML_RARA',
    CEBPA_bZIP: 'MFC',
    FLT3ITD_NPM1wt: ['FLT3_ITD_NGS', 'MFC'],
    FLT3ITD_NPM1mut: ['NPM1', 'FLT3_ITD_NGS'],
    KMT2A_MLLT3: ['KMT2A_qPCR', 'MFC'],
    Fusion_KMT2A: ['KMT2A_qPCR', 'MFC'],
    Other_int: 'MFC',
    Other_adv: 'MFC'
  };

  // Tables definitions based on screenshots
  const tables = {
    CBF: {
      title: "Monitoring by RUNX1-RUNX1T1-qPCR or CBFB-MYH11-qPCR (CBF AML)",
      timePoints: {
        baseline: {
          assay: "CBF-qPCR",
          tissue: "BM",
          rows: [
            {
              threshold: "Quantify baseline transcript levels for log reduction",
              definition: "-",
              response: "-"
            }
          ]
        },
        cycles_2: {
          assay: "CBF-qPCR",
          tissue: "BM",
          rows: [
            {
              threshold: "≥3-log10 reduction from diagnostic levels",
              definition: "MRD at low level/negative",
              response: "Optimal"
            },
            {
              threshold: "<3-log10 reduction from diagnostic levels",
              definition: "Positive",
              response: "Warning"
            }
          ]
        },
        eot: {
          assay: "CBF-qPCR",
          tissue: "BM",
          rows: [
            {
              threshold: "≥3-log10 reduction from diagnostic levels",
              definition: "MRD at low level/negative",
              response: "Optimal"
            },
            {
              threshold: "<3-log10 reduction from diagnostic levels",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        },
        follow_up: {
          assay: "CBF-qPCR",
          tissue: "PB or BM",
          rows: [
            {
              threshold: "<0.001% OR A¹",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "B² AND ≥3-log10 reduction from diagnostic levels OR B² AND <0.1% (in text a general remark: or use clinically validated threshold)",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "Conversion from negative to positive AND ≥0.1% AND B²,³. In patients who have never tested MRD-negative, a ≥1 log10 increase from the measured nadir within the same tissue used for the nadir measurement is required",
              definition: "MRD relapse⁴",
              response: "MRD relapse"
            }
          ]
        }
      },
      footnotes: {
        "1": "A: CT≥40 in ≥2/3 replicates and ≥10,000 ABL1 copies, optimally ≥30,000 ABL1 copies",
        "2": "B: CT<40 in ≥2/3 replicates",
        "3": "MRD relapse based on a qPCR test should be promptly confirmed (≤4 weeks) by a second consecutive sample, preferably both in PB and BM"
      }
    },
    NPM1: {
      title: "Monitoring by NPM1-qPCR using cDNA",
      timePoints: {
        cycles_2: {
          assay: "NPM1-qPCR",
          tissue: "PB",
          rows: [
            {
              threshold: "<0.001% OR undetectable (defined as A¹)",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.001% to <0.01% AND detectable (defined as B²)",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "≥0.01% AND B²",
              definition: "Positive",
              response: "Warning"
            }
          ]
        },
        eot: {
          assay: "NPM1-qPCR",
          tissue: "BM",
          rows: [
            {
              threshold: "<0.001% OR A¹",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.001% to <0.1% AND B²",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "≥0.1% AND B²",
              definition: "Positive",
              response: "High risk of treatment failure³"
            }
          ]
        },
        follow_up: {
          assay: "NPM1-qPCR",
          tissue: "PB or BM",
          rows: [
            {
              tissue: "PB",
              threshold: "<0.001% OR A¹",
              definition: "Negative",
              response: "Optimal"
            },
            {
              tissue: "PB",
              threshold: "<0.01% AND B²,⁴",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              tissue: "PB",
              threshold: "≥0.01% AND B²,⁴,⁵",
              definition: "MRD relapse",
              response: "MRD relapse"
            },
            {
              tissue: "BM",
              threshold: "<0.001% OR A¹",
              definition: "Negative",
              response: "Optimal"
            },
            {
              tissue: "BM",
              threshold: "<0.1% AND B²,⁴",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              tissue: "BM",
              threshold: "≥0.1% AND B²,⁴,⁵",
              definition: "MRD relapse",
              response: "MRD relapse"
            }
          ]
        }
      },
      footnotes: {
        "1": "A: CT≥40 in ≥2/3 replicates and ≥10,000 ABL1 copies, optimally ≥30,000 ABL1 copies",
        "2": "B: CT<40 in ≥2/3 replicates",
        "3": "see comment in the manuscript: alloHCT urgently indicated if patient is eligible with NPM1mut/ABL1 copies ≥1%",
        "4": "In patients who have never tested MRD-negative, a ≥1 log10 increase from the measured nadir within the same tissue used for the nadir measurement is required",
        "5": "MRD relapse based on a qPCR test should be promptly confirmed (≤4 weeks) by a second consecutive sample, preferably both in PB and BM, unless NPM1mut/ABL1 copies are ≥1%"
      }
    },
    PML_RARA: {
      title: "Monitoring by PML::RARA-qPCR (APL)",
      timePoints: {
        eot: {
          assay: "PML::RARA-qPCR",
          tissue: "BM",
          rows: [
            {
              threshold: "<0.001¹% OR A²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.001¹% AND B³",
              definition: "MRD positive",
              response: "Warning"
            }
          ]
        },
        follow_up: {
          assay: "PML::RARA-qPCR",
          tissue: "BM⁵",
          rows: [
            {
              threshold: "<0.001¹% OR A²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.001% AND B³,⁶. In patients who have never tested MRD-negative, a ≥1 log10 increase from the measured nadir within the same tissue used for the nadir measurement is required",
              definition: "MRD relapse⁶",
              response: "MRD relapse"
            }
          ]
        }
      },
      footnotes: {
        "1": "The transcript abundance is typically lower for PML::RARA fusion transcripts compared to other common fusion genes, thus a sensitivity of 0.001% may not be achieved in all patients.",
        "2": "A: CT≥40 in ≥2/3 replicates and ≥10,000 ABL1 copies, optimally ≥30,000 ABL1 copies",
        "3": "B: CT<40 in ≥2/3 replicates",
        "4": "MRD monitoring during follow-up recommended only in patients with high-risk APL who were treated with chemotherapy (e.g. AIDA protocol) and who are MRD positive at EOT, not recommended for patients treated with ATO-based treatments independent of disease risk score if MRD negative at EOT.",
        "5": "PB is not recommended for monitoring as PB usually becomes MRD positive only at frank APL relapse.",
        "6": "MRD relapse based on a qPCR test should be promptly confirmed (≤4 weeks) by a second consecutive sample, preferably both in PB and BM"
      }
    },
    FLT3_ITD_NGS: {
      title: "Monitoring by targeted FLT3-ITD-NGS",
      timePoints: {
        cycles_2: {
          assay: "FLT3-ITD NGS¹",
          tissue: "BM preferred over PB",
          rows: [
            {
              threshold: "≤LOD²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: ">LOD",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        },
        eot: {
          assay: "FLT3-ITD NGS¹",
          tissue: "BM preferred over PB",
          rows: [
            {
              threshold: "≤LOD²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: ">LOD",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        },
        pre_hct: {
          assay: "FLT3-ITD NGS¹",
          tissue: "BM preferred over PB",
          rows: [
            {
              threshold: "≤LOD²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: ">LOD",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        },
        follow_up: {
          assay: "FLT3-ITD NGS¹",
          tissue: "BM preferred over PB",
          rows: [
            {
              threshold: "≤LOD²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: ">LOD",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        }
      },
      footnotes: {
        "1": "Ultrahigh-sensitivity NGS assay.",
        "2": "The assay should be validated to a limit of detection (LOD) of 10⁻⁴ to 10⁻⁵"
      }
    },
    KMT2A_qPCR: {
      title: "Monitoring by KMT2A fusion qPCR (if available)",
      timePoints: {
        cycles_2: {
          assay: "KMT2A fusion qPCR",
          tissue: "BM",
          rows: [
            {
              threshold: "<0.01%",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.01% to <0.1%",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "≥0.1%",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        },
        eot: {
          assay: "KMT2A fusion qPCR",
          tissue: "BM",
          rows: [
            {
              threshold: "<0.01%",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.01% to <0.1%",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "≥0.1%",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        }
      },
      footnotes: {}
    },
    MFC: {
      title: "Monitoring by MFC",
      timePoints: {
        baseline: {
          assay: "MFC",
          tissue: "BM or PB¹",
          rows: [
            {
              threshold: "≥10% of blasts",
              definition: "LAIP assessment",
              response: "-"
            }
          ]
        },
        cycles_2: {
          assay: "MFC",
          tissue: "BM",
          rows: [
            {
              threshold: "<0.01%² OR <LOD²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.01% to <0.1% AND >LOD",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "≥0.1%",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        },
        eot: {
          assay: "MFC",
          tissue: "BM",
          rows: [
            {
              threshold: "<0.01%² OR <LOD²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.01% to <0.1% AND >LOD",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "≥0.1%",
              definition: "Positive",
              response: "High risk of treatment failure"
            }
          ]
        },
        follow_up: {
          assay: "MFC",
          tissue: "BM",
          rows: [
            {
              threshold: "<0.01%² or <LOD²",
              definition: "Negative",
              response: "Optimal"
            },
            {
              threshold: "≥0.01% to <0.1% AND >LOD",
              definition: "MRD at low level",
              response: "Warning"
            },
            {
              threshold: "≥0.1%³",
              definition: "MRD relapse",
              response: "MRD relapse"
            }
          ]
        }
      },
      footnotes: {
        "1": "If blasts are present in PB",
        "2": "Requirements for a sample that qualifies to determine MRD-negativity: ≥500,000 CD45-expressing cells",
        "3": "MRD relapse as defined for MFC may not require a repeat sample in cases with high diagnostic certainty of LAIP or DfN."
      }
    }
  };

  const handleAmlTypeChange = (e) => {
    setAmlType(e.target.value);
    setSubtype('');
    setTimePoint('');
    setSelectedTable(null);
  };

  const handleSubtypeChange = (e) => {
    setSubtype(e.target.value);
    setTimePoint('');
    
    // Set the table when subtype is selected
    if (e.target.value && subtypeToTable[e.target.value]) {
      // Reset selected table
      setSelectedTable(null);
      
      // For array of tables, set to first table
      if (Array.isArray(subtypeToTable[e.target.value])) {
        const primaryTable = subtypeToTable[e.target.value][0];
        setSelectedTable(tables[primaryTable]);
      } else {
        // For single table
        setSelectedTable(tables[subtypeToTable[e.target.value]]);
      }
    } else {
      setSelectedTable(null);
    }
  };

  // Get rows for the selected time point
  const getTimePointData = () => {
    if (!selectedTable || !timePoint || !selectedTable.timePoints[timePoint]) {
      return null;
    }
    return selectedTable.timePoints[timePoint];
  };

  // Get referenced footnote numbers from the current view
  const getReferencedFootnotes = (rows) => {
    if (!rows) return [];
    
    const referencedNumbers = new Set();
    
    // Check thresholds and responses for footnote references
    rows.forEach(row => {
      // Check in threshold
      const threshold = row.threshold || '';
      // Find all numbers between superscript markers (¹²³⁴⁵⁶⁷⁸⁹)
      const thresholdMatches = threshold.match(/[¹²³⁴⁵⁶⁷⁸⁹]/g);
      if (thresholdMatches) {
        thresholdMatches.forEach(match => {
          // Convert superscript to number
          const num = {'¹':1, '²':2, '³':3, '⁴':4, '⁵':5, '⁶':6, '⁷':7, '⁸':8, '⁹':9}[match];
          if (num) referencedNumbers.add(num.toString());
        });
      }
      
      // Also look for footnote references in format A¹, B²
      const alphaNumMatches = threshold.match(/[A-Z]([¹²³⁴⁵⁶⁷⁸⁹])/g);
      if (alphaNumMatches) {
        alphaNumMatches.forEach(match => {
          const superscript = match.substring(1);
          const num = {'¹':1, '²':2, '³':3, '⁴':4, '⁵':5, '⁶':6, '⁷':7, '⁸':8, '⁹':9}[superscript];
          if (num) referencedNumbers.add(num.toString());
        });
      }
      
      // Check definition for references too
      const definition = row.definition || '';
      const defMatches = definition.match(/[¹²³⁴⁵⁶⁷⁸⁹]/g);
      if (defMatches) {
        defMatches.forEach(match => {
          const num = {'¹':1, '²':2, '³':3, '⁴':4, '⁵':5, '⁶':6, '⁷':7, '⁸':8, '⁹':9}[match];
          if (num) referencedNumbers.add(num.toString());
        });
      }
      
      // Check response for references
      const response = row.response || '';
      const responseMatches = response.match(/[¹²³⁴⁵⁶⁷⁸⁹]/g);
      if (responseMatches) {
        responseMatches.forEach(match => {
          const num = {'¹':1, '²':2, '³':3, '⁴':4, '⁵':5, '⁶':6, '⁷':7, '⁸':8, '⁹':9}[match];
          if (num) referencedNumbers.add(num.toString());
        });
      }
    });
    
    return Array.from(referencedNumbers).sort((a, b) => parseInt(a) - parseInt(b));
  };

  // Format time point label for display
  const getTimePointLabel = (tp) => {
    switch(tp) {
      case 'baseline': return 'Baseline';
      case 'cycles_2': return 'After 2 cycles of IC / Pre-HSCT';
      case 'eot': return 'End of treatment';
      case 'follow_up': return 'Follow-up';
      case 'pre_hct': return 'Pre-alloHCT';
      default: return tp;
    }
  };

  const timePointData = getTimePointData();
  const rows = timePointData ? timePointData.rows : [];
  const referencedFootnotes = getReferencedFootnotes(rows);

  // Function to render a table for given table and timepoint
  const renderMRDTable = (tableKey, timePoint) => {
    const table = tables[tableKey];
    if (!table || !table.timePoints[timePoint]) {
      return null;
    }
    
    const timePointData = table.timePoints[timePoint];
    const rows = timePointData.rows;
    const referencedFootnotes = getReferencedFootnotes(rows);
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-red-800">{table.title}</h2>
        
        {/* Table Header/Subtitle with Time Point, Assay, and Tissue */}
        <div className="mb-4">
          <div className="text-md font-medium text-gray-700">
            <p><span className="font-semibold">Timepoint:</span> {getTimePointLabel(timePoint)}</p>
            <p><span className="font-semibold">Recommended assay:</span> {timePointData.assay}</p>
            <p><span className="font-semibold">Recommended tissue:</span> {timePointData.tissue}</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {timePoint === 'follow_up' && timePointData.tissue.includes('or') ? 'Tissue' : ''}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {table.title.includes('NPM1') ? 'NPM1mut/ABL1 copies (%)' : 
                  table.title.includes('CBF') ? 'CBF mutant/ABL1 copies (%)' :
                  table.title.includes('PML') ? 'PML::RARA/ABL1 copies (%)' :
                  table.title.includes('FLT3') ? 'FLT3-ITD VAF (%)' :
                  table.title.includes('KMT2A') ? 'KMT2A fusion/ABL1 copies (%)' :
                  'MRD % (LAIP+ or DfN+ blasts/CD45+ cells)'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Definition
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MRD Response
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length > 0 ? (
                rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {timePoint === 'follow_up' && timePointData.tissue.includes('or') ? row.tissue || '' : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {row.threshold}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {row.definition}
                    </td>
                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                      row.response === 'Optimal' ? 'text-green-600' : 
                      row.response === 'Warning' ? 'text-yellow-600' : 
                      row.response.includes('High risk') || row.response.includes('High risk of treatment failure') ? 'text-red-600' : 
                      row.response.includes('MRD relapse') || row.response.includes('Molecular relapse') ? 'text-red-800 font-bold' : 
                      row.response === '-' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {row.response}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={4} 
                    className="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No specific recommendations available for this time point.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footnotes - only showing referenced ones */}
        {referencedFootnotes.length > 0 && (
          <div className="mt-4 text-xs text-gray-600 space-y-1">
            {referencedFootnotes.map(num => {
              if (table.footnotes[num]) {
                return <p key={num}>
                  {num === "1" ? "¹" : num === "2" ? "²" : num === "3" ? "³" : num === "4" ? "⁴" : num === "5" ? "⁵" : num}{table.footnotes[num]}
                </p>
              }
              return null;
            })}
          </div>
        )}
      </div>
    );
  };

  // Function to render multiple tables for a subtype timepoint
  const renderSubtypeRecommendations = () => {
    if (!subtype || !timePoint) return null;
    
    // Special case for KMT2A rearrangements
    if (subtype === 'KMT2A_MLLT3' || subtype === 'Fusion_KMT2A') {
      return (
        <div>
          <div className="p-6 bg-white rounded-lg mb-6">
            <div className="text-lg text-gray-700 p-4 border-l-4 border-red-800 bg-gray-50">
              <p>Assays for KMT2A-rearranged AML MRD testing have been developed. The need for intervention of fusion-gene persistence in remission at specific thresholds and treatment timepoints remains to be established.</p>
            </div>
          </div>
          
          {/* Still show MFC recommendations */}
          {renderMRDTable('MFC', timePoint)}
        </div>
      );
    }
    
    // Get tables for this subtype
    const tableKeys = subtypeToTable[subtype];
    
    if (Array.isArray(tableKeys)) {
      // Multiple tables for this subtype
      return (
        <div>
          {tableKeys.map((tableKey, index) => {
            if (tables[tableKey] && tables[tableKey].timePoints && tables[tableKey].timePoints[timePoint]) {
              return renderMRDTable(tableKey, timePoint);
            }
            return null;
          })}
        </div>
      );
    } else if (tableKeys) {
      // Single table for this subtype
      return renderMRDTable(tableKeys, timePoint);
    }
    
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gray-200 min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-red-900 mb-2">AML MRD - Clinician's Guide</h1>
        <p className="text-lg text-gray-700">European LeukemiaNet (ELN) 2025 MRD Guidelines</p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Select Patient Characteristics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* AML Type Selection */}
          <div>
            <label htmlFor="amlType" className="block text-sm font-medium text-gray-700 mb-1">ELN 2022 Risk Category</label>
            <select
              id="amlType"
              value={amlType}
              onChange={handleAmlTypeChange}
              className="block w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select Risk Category</option>
              <option value="favorable">Favorable</option>
              <option value="intermediate">Intermediate</option>
              <option value="adverse">Adverse</option>
            </select>
          </div>

          {/* Subtype Selection */}
          <div>
            <label htmlFor="subtype" className="block text-sm font-medium text-gray-700 mb-1">Molecular Subgroup</label>
            <select
              id="subtype"
              value={subtype}
              onChange={handleSubtypeChange}
              disabled={!amlType}
              className="block w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            >
              <option value="">Select Subgroup</option>
              {amlType && subtypeOptions[amlType] ? subtypeOptions[amlType].map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              )) : null}
            </select>
          </div>

          {/* Time Point Selection */}
          <div>
            <label htmlFor="timePoint" className="block text-sm font-medium text-gray-700 mb-1">Assessment Time Point</label>
            <select
              id="timePoint"
              value={timePoint}
              onChange={(e) => setTimePoint(e.target.value)}
              disabled={!subtype}
              className="block w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            >
              <option value="">Select Time Point</option>
              {subtype && subtypeTimePoints[subtype] ? subtypeTimePoints[subtype].map(tp => (
                <option key={tp} value={tp}>{timePointOptions[tp].label}</option>
              )) : null}
            </select>
          </div>
        </div>
      </div>

      {/* Display MRD Assessment Tables */}
      {subtype && timePoint ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Display info text for specific subtypes */}
          {subtype === 'FLT3ITD_NPM1wt' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-gray-700">
              <p className="font-semibold text-xl text-red-800">For FLT3-ITD and NPM1wt:</p>
              <p className="text-lg">FLT3-ITD NGS if available, otherwise MFC</p>
            </div>
          )}
          {subtype === 'FLT3ITD_NPM1mut' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-gray-700">
              <p className="font-semibold text-xl text-red-800">For FLT3-ITD and NPM1mut:</p>
              <p className="text-lg">NPM1-qPCR and FLT3-ITD NGS if available</p>
            </div>
          )}
          {subtype === 'KMT2A_MLLT3' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-gray-700">
              <p className="font-semibold text-xl text-red-800">For KMT2A::MLLT3, other fusion genes¹:</p>
              <p className="text-lg">AML specific fusion genes as listed in ref Döhner et al. 2022 can be used if a validated assay is available.</p>
            </div>
          )}
          {subtype === 'Fusion_KMT2A' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-gray-700">
              <p className="font-semibold text-xl text-red-800">For Fusion genes (e.g., KMT2A::r):</p>
              <p className="text-lg">qPCR if available, otherwise MFC</p>
            </div>
          )}
          {subtype === 'CEBPA_bZIP' && (
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-gray-700">
              <p className="font-semibold text-xl text-red-800">For CEBPA bZIP in-frame:</p>
              <p className="text-lg">There is some evidence that MFC-MRD is prognostic in CEBPA-bZIP mutated AML after two cycles of intensive chemotherapy. Future research should also evaluate end of treatment and follow-up.</p>
            </div>
          )}
          
          {/* Render tables */}
          {renderSubtypeRecommendations()}
        </div>
      ) : null}

      {subtype === 'KMT2A_MLLT3' && !timePoint && (
        <div className="mt-4 text-sm text-gray-600">
          <p>¹ AML specific fusion genes as listed in Döhner et al. 2022 can be used if a validated assay is available.</p>
        </div>
      )}

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>European LeukemiaNet (ELN) 2025 MRD Guidelines - Development Version</p>
      </footer>
    </div>
  );
}

export default App;
