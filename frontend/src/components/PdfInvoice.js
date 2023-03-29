import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAppointments,
  fetchSingleAppointment,
} from "../store/features/appointmentsSlice";
import { useState, useEffect } from "react";

export default function PdfInvoice() {
  const styles = StyleSheet.create({
    page: {
      backgroundColor: "#FFFFFF",
    },
    viewer: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    headerTable: {
      display: "table",
      width: "auto",
      margin: 40,
    },
    headerTableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    headerTableCol: {
      width: "33%",
    },
    headerTableCell: {
      marginTop: 5,
      fontSize: 30,
      textAlign: "center",
    },
    infoTable: {
      display: "table",
      width: "auto",
      borderTop: 1,
      borderLeft: 1,
      borderRight: 1,
      marginHorizontal: 40,
      marginBottom: 20,
    },
    infoTableRow: {
      margin: "auto",
      flexDirection: "row",
    },
    infoTableCol: {
      width: "33%",
    },
    infoTableCell: {
      paddingVertical: 2,
      fontSize: 12,
      paddingHorizontal: 20,
      textAlign: "left",
    },
    boldTableCell: {
      marginTop: 5,
      fontSize: 12,
      textAlign: "left",
      fontWeight: "bold",
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    topTableRow: {
      flexDirection: "row",
      borderTop: 1,
      marginVertical: 10,
    },
    bottomTableRow: {
      flexDirection: "row",
      borderBottom: 1,
      marginTop: 10,
    },
    noBorderTableRow: {
      flexDirection: "row",
    },
    invisibleTable: {
      display: "table",
      width: "auto",
      marginHorizontal: 40,
      marginVertical: 10,
    },
    invisibleTableCell: {
      marginTop: 5,
      fontSize: 12,
      textAlign: "left",
    },
    bottomLeftTableCol: {
      width: "50%",
      borderRight: 1,
    },
    bottomRightTableCol: {
      width: "50%",
    },
    rightTableCell: {
      fontSize: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      textAlign: "right",
    },
    leftTableCell: {
      fontSize: 12,
      paddingHorizontal: 20,
      paddingVertical: 10,
      textAlign: "left",
    },
    bottomTableRowWithBorder: {
      flexDirection: "row",
      borderBottom: 1,
      borderRight: 1,
    },
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAppointments());
  }, []);

  const appointments = useSelector((state) => state.appointments);
  const appointment = appointments.singleAppointment;
  const bill = useSelector((state) => state.bill.singleBill);
  const examinationtypes = useSelector((state) => state.examinationtypes);
  const appointmenttypes = useSelector((state) => state.appointmenttypes);
  const calcTotal = () => {
    const usedsPrice = bill.Supplies.reduce(
      (a, b) => a + b.price * b.amount,
      0
    );
    const examinationsPrice = bill.Examinations.reduce(
      (a, b) => a + b.price,
      0
    );
    return (
      (parseFloat(usedsPrice) +
      parseFloat(bill.service_price) +
      parseFloat(examinationsPrice)).toFixed(2)
    );
  };

  const formattedDueDate = () => {
    const date = bill.due_date.split(" ");
    const dateArray = date[0].split("-");
    return dateArray[2] + "." + dateArray[1] + "." + dateArray[0];
  };

  return (
    <PDFViewer style={styles.viewer}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.headerTable}>
            <View style={styles.headerTableRow}>
              <View style={styles.headerTableCol}>
                <Text style={styles.headerTableCell}>Lasku</Text>
              </View>
              <View style={styles.headerTableCol}></View>
              <View style={styles.headerTableCol}>
                <View style={styles.headerTableRow}>
                  <Text style={styles.infoTableCell}>Lempiellit Oy</Text>
                </View>
                <View style={styles.headerTableRow}>
                  <Text style={styles.infoTableCell}>
                    {(
                      "0" + new Date(appointment.starting_date).getDate()
                    ).slice(-2) +
                      "." +
                      (
                        "0" +
                        (new Date(appointment.starting_date).getMonth() + 1)
                      ).slice(-2) +
                      "." +
                      new Date(appointment.starting_date).getFullYear()}
                  </Text>
                </View>
                <View style={styles.headerTableRow}>
                  <Text style={styles.infoTableCell}>Laskun numero</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.infoTable}>
            <View style={styles.noBorderTableRow}></View>
            <View style={styles.noBorderTableRow}>
              <View style={styles.infoTableCol}>
                <Text style={styles.boldTableCell}>Loppusumma yhteensä</Text>
              </View>
              <View style={styles.infoTableCol}></View>
              <View style={styles.infoTableCol}>
                <Text style={styles.boldTableCell}>{calcTotal()} EUR</Text>
              </View>
            </View>
            <View style={styles.noBorderTableRow}></View>
            <View style={styles.topTableRow}></View>
            <View style={styles.noBorderTableRow}>
              <View style={styles.infoTableCol}>
                <Text style={styles.infoTableCell}>Viite</Text>
              </View>
              <View style={styles.infoTableCol}>
                <Text style={styles.infoTableCell}>Eräpäivä</Text>
              </View>
              <View style={styles.infoTableCol}>
                <Text style={styles.infoTableCell}>Maksettava</Text>
              </View>
            </View>
            <View style={styles.noBorderTableRow}>
              <View style={styles.infoTableCol}>
                <Text style={styles.infoTableCell}>12345</Text>
              </View>
              <View style={styles.infoTableCol}>
                <Text style={styles.infoTableCell}>{formattedDueDate()}</Text>
              </View>
              <View style={styles.infoTableCol}>
                <Text style={styles.infoTableCell}>{calcTotal()} EUR</Text>
              </View>
            </View>
            <View style={styles.bottomTableRow}></View>
          </View>
          <View style={styles.invisibleTable}>
            <Text style={styles.invisibleTableCell}>Laskun erittely</Text>
          </View>
          <View style={styles.infoTable}>
            <View style={styles.noBorderTableRow}>
              <View style={styles.infoTableCol}>
                {appointmenttypes.appointmenttypes
                  .filter((type) => type.id === appointment.appointment_type_id)
                  .map((type) => {
                    return (
                      <Text style={styles.leftTableCell}>
                        {type.name} {appointment.length} min
                      </Text>
                    );
                  })}
              </View>
              <View style={styles.infoTableCol}>
                <Text style={styles.rightTableCell}>Käyntimaksu</Text>
              </View>
              <View style={styles.infoTableCol}>
                <Text style={styles.rightTableCell}>
                  {bill.service_price.toFixed(2)} EUR
                </Text>
              </View>
            </View>
            {bill.Examinations.map((row) => {
              return (
                <View style={styles.noBorderTableRow}>
                  <View style={styles.infoTableCol}>
                    <Text style={styles.leftTableCell}>{row.name}</Text>
                  </View>
                  <View style={styles.infoTableCol}></View>
                  <View style={styles.infoTableCol}>
                    <Text style={styles.rightTableCell}>{row.price.toFixed(2)} EUR</Text>
                  </View>
                </View>
              );
            })}
            {bill.Supplies.map((row) => {
              return (
                <View style={styles.noBorderTableRow}>
                  <View style={styles.infoTableCol}>
                    <Text style={styles.leftTableCell}>{row.name}</Text>
                  </View>
                  <View style={styles.infoTableCol}>
                    <Text style={styles.rightTableCell}>
                      {row.amount} kpl à {row.price.toFixed(2)} EUR
                    </Text>
                  </View>
                  <View style={styles.infoTableCol}>
                    <Text style={styles.rightTableCell}>
                      {(row.amount * row.price).toFixed(2)} EUR
                    </Text>
                  </View>
                </View>
              );
            })}
            <View style={styles.noBorderTableRow}>
              <View style={styles.infoTableCol}>
                <Text style={styles.leftTableCell}>Yhteensä</Text>
              </View>
              <View style={styles.infoTableCol}></View>
              <View style={styles.infoTableCol}>
                <Text style={styles.rightTableCell}>
                  {calcTotal() + " EUR"}
                </Text>
              </View>
            </View>
            <View style={styles.bottomTableRowWithBorder}></View>
            <View style={styles.noBorderTableRow}>
              <View style={styles.bottomLeftTableCol}>
                <Text style={styles.leftTableCell}>Saajan tilinumero</Text>
              </View>
              <View style={styles.bottomRightTableCol}>
                <Text style={styles.leftTableCell}>Saaja</Text>
              </View>
            </View>
            <View style={styles.noBorderTableRow}>
              <View style={styles.bottomLeftTableCol}>
                <Text style={styles.infoTableCell}>957023525</Text>
              </View>
              <View style={styles.bottomRightTableCol}>
                <Text style={styles.infoTableCell}>Lempiellit Oy</Text>
              </View>
            </View>
            <View style={styles.bottomTableRowWithBorder}></View>
            <View style={styles.noBorderTableRow}>
              <View style={styles.bottomLeftTableCol}>
                <Text style={styles.leftTableCell}>Viitenro</Text>
              </View>
              <View style={styles.bottomRightTableCol}>
                <Text style={styles.leftTableCell}>Eräpäivä</Text>
              </View>
            </View>
            <View style={styles.noBorderTableRow}>
              <View style={styles.bottomLeftTableCol}>
                <Text style={styles.infoTableCell}>12345</Text>
              </View>
              <View style={styles.bottomRightTableCol}>
                <Text style={styles.infoTableCell}>{formattedDueDate()}</Text>
              </View>
            </View>
            <View style={styles.bottomTableRowWithBorder}></View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
