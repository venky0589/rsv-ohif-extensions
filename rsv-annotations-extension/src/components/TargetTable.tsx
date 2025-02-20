import React, { useState } from 'react';

const TargetTable = ({ data, curAndPrev }) => {
  const [accordionStates, setAccordionStates] = useState({
    target: true,
    'non-target': true,
    'new-lesion': true,
  });

  const [modalAccordionStates, setModalAccordionStates] = useState({
    target: true,
    'non-target': true,
    'new-lesion': true,
  });

  const [expandView, setExpandView] = useState(false);

  const toggleAccordion = (section, isModal = false) => {
    if (isModal) {
      setModalAccordionStates(prevStates => ({
        ...prevStates,
        [section]: !prevStates[section],
      }));
    } else {
      setAccordionStates(prevStates => ({
        ...prevStates,
        [section]: !prevStates[section],
      }));
    }
  };

  const closeExpandView = () => {
    setExpandView(false);
  };

  const openExpandView = () => {
    setExpandView(true);
  };

  const renderAccordionContent = (section, isModal = false) => {
    const stateToUse = isModal ? modalAccordionStates : accordionStates;
    const followUps = isModal ? Object.keys(data) : curAndPrev;
    const allFollowUps = Object.keys(data);

    const formatValue = value => {
      console.log("FORMAT VALUE");
      const decimalRegex = /^-?\d+\.\d+$/;

      // Check if input matches the decimal pattern
      if (decimalRegex.test(value)) {
        // Convert to number and format to 2 decimal places
        const formattedNumber = parseFloat(value).toFixed(2);
        return formattedNumber;
      } else if (typeof value === 'number' && value % 1 !== 0) {
        return value.toFixed(2);
      }
      return value;
    };

    const isLastRow = rowIndex => rowIndex === data[allFollowUps[3]][section]?.lesions?.length - 1;
    const isLastColumn = colIndex => colIndex === followUps.length - 1;

    return (
      <div className="accordion-content">
        <table className="text-primary-light mt-1 w-full border-collapse">
          <thead>
            <tr className="border-secondary-light border-b">
              <th className="border-secondary-light p-2 text-center text-[12px] font-medium">
                <div className="bg-bkg-med w-[120px] p-2">Timepoints</div>
              </th>
              {followUps.map((followUp, index) => (
                <th
                  key={index}
                  className={`border-secondary-light p-2 text-left text-[12px] font-medium ${index % 2 === 0 ? 'bg-popover' : 'bg-bkg-med'
                    }`}
                >
                  <div className="font-semibold text-green-500">{followUp}</div>
                  <div className="text-primary-light font-normal">
                    {formatValue(data[followUp]['studyDate']) || 'N/A'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data[allFollowUps[3]][section]?.lesions?.map((lesion, rowIndex) => (
              <tr
                key={lesion.ROILabel || rowIndex}
                className={`border-secondary-light ${isLastRow(rowIndex) ? '' : 'border-b'}`}
              >
                <td className="border-secondary-light p-2 text-left text-[12px] font-medium">
                  <div className="flex items-center justify-between gap-2">
                    <div className="bg-bkg-med w-[120px] rounded p-2 text-center">
                      <div>{lesion.ROILabel || `Lesion ${rowIndex + 1}`}</div>
                      <div>{lesion['organ'] || 'Unknown'}</div>
                    </div>
                    <div>
                      <div>LD</div>
                      <div>SD</div>
                    </div>
                  </div>
                </td>
                {followUps.map((followUp, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border-secondary-light p-2 text-left text-[14px] font-medium ${colIndex % 2 === 0 ? 'bg-popover' : 'bg-bkg-med'
                      }`}
                  >
                    <div>{formatValue(data[followUp][section]?.lesions[rowIndex]?.ld || data[followUp][section]?.lesions[rowIndex]?.LD) || 'N/A'}</div>
                    <div>{formatValue(data[followUp]?.[section]?.lesions?.[rowIndex]?.sd || data[followUp][section]?.lesions[rowIndex]?.SD) || 'N/A'}</div>
                  </td>
                ))}
              </tr>
            ))}
            {section === 'target' && (
              <>
                <tr className="bg-primary-dark border-secondary-light border-b border-t bg-opacity-50">
                  <td className="border-secondary-light p-2 text-center text-[12px] font-medium">
                    <div className="w-[120px] rounded p-2">
                      <div>Sum All</div>
                      <div>%(Baseline)</div>
                      <div>%(Smallest)</div>
                    </div>
                  </td>
                  {followUps.map((followUp, followUpIndex) => (
                    <td
                      key={followUpIndex}
                      className={`border-secondary-light p-2 text-left text-[14px] font-medium`}
                    >
                      <div>{formatValue(data[followUp].target.summary['sumAll'])}</div>
                      <div>{formatValue(data[followUp].target.summary['baseline'])}</div>
                      <div>{formatValue(data[followUp].target.summary['smallest'])}</div>
                    </td>
                  ))}
                </tr>

                <tr className="bg-primary-dark bg-opacity-50">
                  <td className="border-secondary-light p-2 text-center text-[12px] font-bold">
                    <div className="w-[120px] rounded p-2">Response</div>
                  </td>
                  {followUps.map((followUp, followUpIndex) => (
                    <td
                      key={followUpIndex}
                      className={`border-secondary-light p-2 text-left text-[14px] font-bold`}
                    >
                      {data[followUp][section]?.response || 'N/A'}
                    </td>
                  ))}
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  if (Object.keys(data).length === 0) {
    return (<></>)
  } else {
    return (

      <div className="ohif-scrollbar h-[900px] w-full rounded-lg pr-2 shadow-lg">
        <div className="accordion mt-1">
          {['target', 'non-target', 'new-lesion'].map(section => (
            <div key={section} className="accordion-item mb-2">
              <div
                className="accordion-header bg-popover flex cursor-pointer items-center justify-between rounded px-2 py-1"
                onClick={() => toggleAccordion(section)}
              >
                <div className="flex gap-2 text-[20px] font-light text-white">
                  <div className="accordion-icon">{accordionStates[section] ? '-' : '+'}</div>
                  <div className="accordion-title">{data[Object.keys(data)[3]]?.[section].title}</div>
                </div>
                <div className="flex items-center gap-2">
                  {section === 'target' && (
                    <div className="accordion-label bg-primary-light rounded px-1 text-xs text-black">
                      Max {data[Object.keys(data)[3]][section]['maxItems']}
                    </div>
                  )}
                  <div className="accordion-count text-primary-light text-2xl font-light">0</div>
                </div>
              </div>
              {accordionStates[section] && renderAccordionContent(section)}
            </div>
          ))}
        </div>

        <div className="mt-5 mb-10 text-center">
          <button
            className="bg-popover rounded px-3 py-1 text-[12px] text-white"
            onClick={openExpandView}
          >
            Expand View
          </button>
        </div>

        {/* Modal for Expand View */}
        {expandView && (
          <div className="modal bg-bkg-med fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
            <div className="max-h-4xl w-[90%] max-w-4xl rounded-lg bg-black p-4">
              <div className="border-b-secondary-light mb-5 flex items-center justify-between border-[1px] border-transparent px-2 py-1">
                <div className="text-primary-light text-xl text-white">All Key Timepoints</div>
                <button className="text-primary-light text-xl text-white" onClick={closeExpandView}>
                  &#10006;
                </button>
              </div>
              <div className="accordion ohif-scrollbar modal-content max-h-2xl overflow-y-auto">
                {['target', 'non-target', 'new-lesion'].map(section => (
                  <div key={section} className="accordion-item mb-2">
                    <div
                      className="accordion-header bg-popover flex cursor-pointer items-center justify-between rounded px-2 py-1"
                      onClick={() => toggleAccordion(section, true)}
                    >
                      <div className="flex gap-2 text-[20px] font-light text-white">
                        <div className="accordion-icon">
                          {modalAccordionStates[section] ? '-' : '+'}
                        </div>
                        <div className="accordion-title">
                          {data[Object.keys(data)[3]][section].title}
                        </div>
                        {/* Dynamic title */}
                      </div>
                      <div className="flex items-center gap-2">
                        {section === 'target' && (
                          <div className="accordion-label bg-primary-light rounded px-1 text-xs text-black">
                            Max {data[Object.keys(data)[3]][section]['maxItems']}
                          </div>
                        )}
                        <div className="accordion-count text-primary-light text-2xl font-light">
                          0 {/* {data[Object.keys(data)[3]][section]['count']} */}
                        </div>
                      </div>
                    </div>
                    {modalAccordionStates[section] && renderAccordionContent(section, true)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
};

export default TargetTable;