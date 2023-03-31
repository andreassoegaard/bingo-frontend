import { useEffect, useState } from "react";
import supabase from "@/lib/supabase-browser";
import LogOutButton from "@/components/auth/LogOutButton";
import PlatformWrapper from "@/components/wrappers/PlatformWrapper";
import groupBy from "lodash.groupby";
import PageWrapper from "@/components/wrappers/PageWrapper";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import type { RowInput, CellInput, CellDef } from "jspdf-autotable";
import Button from "@/components/ui/Button";
import { selectOrgState, selectOrgName, setOrgState } from "@/store/orgSlice";
import { useDispatch, useSelector } from "react-redux";
import { useIsAdmin } from "@/hooks/isAdmin";

export default function Home() {
  const orgName = useSelector(selectOrgName);
  const orgState = useSelector(selectOrgState);
  const dispatch = useDispatch();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
    };
    fetchSession();
  }, []);

  const [plates, setPlates] = useState<any[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("banko_plates").select();
      setPlates(
        Object.entries(groupBy(data, "group_key")).map(
          (item: any) => (item = item[1])
        )
      );
    };
    fetchData();
  }, []);

  const downloadPdf = () => {
    // Default export is a4 paper, portrait, using millimeters for units

    const format = [320, 450];
    const orientation = "landscape";
    const doc = new jsPDF({
      orientation,
      unit: "mm",
      format,
    });

    // for (let i = 0; i < pageCount; i++) {
    //   doc.setPage(i);
    //   doc.setFillColor("E1CEB1");
    //   doc.rect(0, 0, 450, 320, "F");
    // }

    const cellDimensions = 23.25;

    let j = 1;
    plates.forEach((plateOfSix, index) => {
      plateOfSix.forEach((singlePlate: any) => {
        let startY: number;
        let startX: number;
        if (j === 1 || j === 4) {
          startY = 28;
        } else if (j === 2 || j === 5) {
          startY = 123;
        } else {
          startY = 218;
        }
        if (j >= 4 && j <= 6) {
          startX = 229;
        } else {
          startX = 11;
        }

        const rowOne: CellDef[] = singlePlate.plate_json[0].map((item) =>
          item ? item.value : null
        );
        const rowTwo: CellDef[] = singlePlate.plate_json[1].map((item) =>
          item ? item.value : null
        );
        const rowThree: CellDef[] = singlePlate.plate_json[2].map((item) =>
          item ? item.value : null
        );
        autoTable(doc, {
          body: [rowOne, rowTwo, rowThree],
          margin: { top: 40, left: startX },
          startY,
          styles: {
            fillColor: 255,
            cellWidth: cellDimensions,
            minCellHeight: cellDimensions + 3,
            lineColor: "#000",
            lineWidth: 0.5,
            fontSize: 36,
            fontStyle: "bold",
            textColor: "#000",
            halign: "center",
            valign: "middle",
          },
          tableWidth: "wrap",
          didParseCell: (data) => {
            if (data.cell.raw) {
              data.cell.styles.fillColor = [255, 255, 255];
            } else {
              data.cell.styles.fillColor = [235, 235, 235];
            }
          },
          didDrawPage: (data: any) => {
            const yPos = data.cursor.y;
            // const xPos = data.cursor.x - 70;
            // const img = document.createElement("img");
            // img.id = "itf";
            // console.log(img);
            // JsBarcode(img, "12345678901237", {
            //   format: "itf",
            //   height: 110,
            //   displayValue: false,
            // });
            // doc.addImage(img.src, "JPEG", xPos, yPos + 1, 70, 9);
            doc.setFillColor("#666");
            doc.rect(startX - 0.2, yPos, 0.5, 7, "F");
            doc.rect(data.cursor.x - 0.2, yPos, 0.5, 7, "F");
            doc.rect(
              startX - 0.2,
              yPos + 7,
              data.cursor.x - startX + 0.5,
              0.5,
              "F"
            );
            doc.setFontSize(14);
            const textWidth = doc.getTextWidth(`Røjle Forsamlingshus`);
            doc.setTextColor("#666");
            doc.text(
              "Røjle Forsamlingshus",
              data.cursor.x - textWidth - 2,
              yPos + 5
            );
            doc.setTextColor("#000");
            doc.setFont("Helvetica", "Bold");
            doc.text(`Plade RF${singlePlate.human_id}`, startX + 2, yPos + 5);
          },
        });
        if (j % 6 === 0) {
          j = 1;
          if (index !== plates.length - 1) {
            doc.addPage(format, orientation);
          }
        } else {
          j++;
        }
      });
    });
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(26);
      doc.setFont("Helvetica", "Bold");
      doc.text("Røjle Forsamlingshus", 11, 19);
      doc.text("Røjle Forsamlingshus", 229, 19);
    }
    doc.save("SRA3 - bankoplader.pdf");
  };
  return (
    <>
      <PageWrapper title='Forside'>
        <PlatformWrapper title='Forside'>
          {/* {orgName}
          {orgState}
          <Button onClick={changeState} style='indigo'>
            Change state
          </Button>
          Youre in! <LogOutButton />
          <Button onClick={downloadPdf} style='indigo'>
            Download PDF
          </Button> */}
          <LogOutButton />
          {plates.map((plateOfSix, index) => {
            return (
              <div key={index} className='border-b border-gray-300 mb-3 pb-3'>
                {plateOfSix.map((plate: any, plateIndex: number) => {
                  return (
                    <ul className='bs-board' key={plateIndex}>
                      {plate.plate_json.map(
                        (innerPlateRow: any, innerPlateIndex: number) => {
                          return (
                            <li key={innerPlateIndex} className='bs-board__row'>
                              {innerPlateRow.map(
                                (item: any, itemIndex: number) => {
                                  return (
                                    <div
                                      key={itemIndex}
                                      className='bs-board__item'
                                    >
                                      {item ? item.value : item}
                                    </div>
                                  );
                                }
                              )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                  );
                })}
              </div>
            );
          })}
        </PlatformWrapper>
      </PageWrapper>
    </>
  );
}
