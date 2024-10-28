import {useState, useEffect} from "react";
import {
    Box,
    TextField,
    Typography,
    Snackbar,
    Alert,
    Button,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";
import Grid from "@mui/material/Grid2"
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";

const locales = ["en-gb"];

// Constants for payment intervals
const PayEveryType = {
    ONE_MONTH: 1,
    TWO_MONTHS: 2,
    THREE_MONTHS: 3,
    FOUR_MONTHS: 4,
    SIX_MONTHS: 6,
    ONE_YEAR: 12,
};

function AddAGrant({setData, item, onClose, userId, setUserGrants}) {
    const [grant, setGrant] = useState(null); // Selected grant
    const [grantAmount, setGrantAmount] = useState(""); // Grant amount for the user
    const [totalAmountLeft, setTotalAmountLeft] = useState(0); // Amount left in the grant
    const [error, setError] = useState(null); // Error handling
    const [payments, setPayments] = useState([]); // Payments calculated based on input
    const [range, setRange] = useState({startDate: null, endDate: null}); // Date range for payments
    const [payEvery, setPayEvery] = useState(3)
    const {setLoading} = useToastContext();
    useEffect(() => {
        if (grant) {
            setTotalAmountLeft(grant.query.amountLeft); // Set total amount left when a grant is selected
        }
    }, [grant]);

    const handleGrantAmountChange = (e) => {
        const value = parseFloat(e.target.value);
        if (value > totalAmountLeft) {
            setError(`المبلغ المتبقي هو ${totalAmountLeft}، لا يمكنك تحديد مبلغ أكبر.`);
            setGrantAmount("");
        } else {
            setError(null);
            setGrantAmount(value);
        }
    };

    const calculateInstallments = () => {
        if (!range.startDate || !range.endDate || !grantAmount) return;

        const start = dayjs(range.startDate);
        const end = dayjs(range.endDate);
        const months = end.diff(start, "month");

        if (months <= 0 || grantAmount > totalAmountLeft) {
            setError("تأكد من صحة المبلغ والمده.");
            return;
        }

        const numPayments = Math.ceil(months / payEvery); // Payments based on selected interval
        const installmentAmount = grantAmount / numPayments;
        let remainingAmount = grantAmount;
        const newPayments = Array(numPayments)
              .fill()
              .map((_, index) => {
                  const dueDate = start.add(index * payEvery, "month");
                  const installmentAmountForCurrentPayment = index === numPayments - 1 ? remainingAmount : Math.floor(installmentAmount);
                  remainingAmount -= installmentAmountForCurrentPayment;
                  return {
                      dueDate: dueDate.format("YYYY-MM-DD"),
                      amount: installmentAmountForCurrentPayment,
                  };
              });

        setPayments(newPayments);
    };

    useEffect(() => {
        if (range.startDate && range.endDate && payEvery && grantAmount) {
            calculateInstallments();
        }
    }, [range, grantAmount, payEvery]);

    const handlePaymentChange = (index, field, value) => {
        const updatedPayments = [...payments];
        updatedPayments[index][field] = value;
        setPayments(updatedPayments);
    };

    // Validate and handle the form submission
    const onSubmit = async () => {
        if (!grant || grantAmount > totalAmountLeft || payments.length === 0) {
            setError("تأكد من صحة البيانات قبل الإرسال.");
            return;
        }
        const totalPayments = payments.reduce((acc, payment) => acc + parseFloat(payment.amount), 0);
        if (totalPayments !== grantAmount) {
            setError(`إجمالي المدفوعات (${totalPayments}) لا يطابق المبلغ المحدد (${grantAmount}).`);
            return;
        }
        const startDate = dayjs(range.startDate);
        const endDate = dayjs(range.endDate);

        const invalidDate = payments.some(payment => {
            const dueDate = dayjs(payment.dueDate);
            return dueDate.isBefore(startDate) || dueDate.isAfter(endDate);
        });

        if (invalidDate) {
            setError("تأكد من أن جميع تواريخ الاستحقاق تقع ضمن نطاق تاريخ البدء وتاريخ النهاية.");
            return;
        }


        const request = await handleRequestSubmit({
            totalAmounts: totalPayments,
            totalAmountLeft,
            payments,
            payEvery,
            startDate,
            endDate,
            grantId: grant.query.id,
            userId: userId
        }, setLoading, `shared/grants/applications/student/${item.id}/user-grant`, false, "جاري تعين منحه للطالب")
        if (request.status === 200) {
            if (setData) {
                setData((old) => old.filter((i) => i.id !== item.id))
            }
            if (setUserGrants) {
                setUserGrants((old) => ([...old, {
                    startDate,
                    endDate,
                    totalPayments,
                    payEvery,
                    payments,
                    grant: {name: grant.query.name}
                }]))
            }
            onClose()
        }
    };

    const isSubmitDisabled = !grant || !grantAmount || !range.startDate || !range.endDate || payments.length === 0;

    return (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locales}>

              <Typography variant="h4" gutterBottom>
                  إضافة منحة جديدة
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                  الرجاء اختيار منحة، تحديد المبلغ، مدة الدفع، ومدة كل دفعة. ستتمكن بعد ذلك من رؤية جدول الدفع.
              </Typography>
              <SearchComponent
                    apiEndpoint="search?model=grant"
                    setFilters={setGrant}
                    inputLabel="ابحث بالاسم لاختيار منحة"
                    renderKeys={["name", "amount", "amountLeft"]}
                    mainKey="name"
              />

              {grant && (
                    <Box mt={3}>
                        <Box spacing={2} my={2}>
                            <Typography variant="h6">معلومات المنحة</Typography>
                            <Typography>الاسم: {grant.query.name}</Typography>
                            <Typography>المبلغ الكلي: {grant.query.amount}</Typography>
                            <Typography>المبلغ المتبقي: {grant.query.amountLeft}</Typography>

                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextField
                                      sx={(theme) => ({
                                          backgroundColor: theme.palette.background.default
                                      })}
                                      variant="outlined"
                                      type="number"
                                      label="المبلغ المراد تخصيصه"
                                      value={grantAmount}
                                      id="amount"
                                      onChange={handleGrantAmountChange}
                                      fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl fullWidth
                                             sx={(theme) => ({
                                                 backgroundColor: theme.palette.background.default
                                             })}
                                             variant="outlined"
                                >
                                    <InputLabel id="payEvery-label">
                                        دفع كل
                                    </InputLabel>
                                    <Select
                                          value={payEvery}
                                          onChange={(e) => setPayEvery(parseInt(e.target.value))}
                                          fullWidth
                                          labelId="payEvery-label"
                                          label="دفع كل"
                                          id="payEvery"
                                    >
                                        <MenuItem value={PayEveryType.ONE_MONTH}>كل شهر</MenuItem>
                                        <MenuItem value={PayEveryType.TWO_MONTHS}>كل شهرين</MenuItem>
                                        <MenuItem value={PayEveryType.THREE_MONTHS}>كل 3 أشهر</MenuItem>
                                        <MenuItem value={PayEveryType.FOUR_MONTHS}>كل 4 أشهر</MenuItem>
                                        <MenuItem value={PayEveryType.SIX_MONTHS}>كل 6 أشهر</MenuItem>
                                        <MenuItem value={PayEveryType.ONE_YEAR}>كل سنة</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl
                                      fullWidth
                                      sx={{bgcolor: 'background.default'}}
                                      margin={"none"}
                                >
                                    <DatePicker
                                          label="تاريخ بداية المنحه"
                                          value={range.startDate ? dayjs(range.startDate).locale("en-gb") : null}
                                          onChange={(date) => {
                                              setRange({...range, startDate: date ? date.format("YYYY-MM-DD") : null})
                                          }}
                                          slotProps={{
                                              textField: {
                                                  error: !!error,
                                                  inputProps: {
                                                      placeholder: "DD/MM/YYYY",
                                                  },
                                              },
                                          }}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <FormControl
                                      fullWidth
                                      sx={{bgcolor: 'background.default'}}
                                      margin={"none"}
                                >
                                    <DatePicker
                                          label="تاريخ نهاية المنحه"
                                          fullWidth
                                          sx={{bgcolor: 'background.default'}}
                                          value={range.endDate ? dayjs(range.endDate).locale("en-gb") : null}
                                          onChange={(date) => {
                                              setRange({...range, endDate: date ? date.format("YYYY-MM-DD") : null})
                                          }}
                                          slotProps={{
                                              textField: {
                                                  error: !!error,
                                                  inputProps: {
                                                      placeholder: "DD/MM/YYYY",
                                                  },
                                              },
                                          }}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>

              )}

              {grant && grantAmount <= totalAmountLeft && range.startDate && range.endDate && payments.length > 0 && (
                    <Box mt={3}>
                        <Typography variant="h6">الدفعات:</Typography>
                        <Grid container spacing={2}>
                            {payments.map((payment, index) => (
                                  <Grid size={{xs: 12, md: 6}} key={index} mb={3} p={3} border={1} borderRadius={2}
                                        borderColor="grey.300">
                                      <Typography variant="h6" mb={2}>الدفعه {index + 1}</Typography>
                                      <FormControl
                                            fullWidth
                                            sx={{bgcolor: 'background.default'}}
                                            margin={"none"}
                                      >
                                          <DatePicker
                                                label="تاريخ الاستحقاق"
                                                sx={{bgcolor: 'background.default'}}
                                                value={payment.dueDate ? dayjs(payment.dueDate).locale("en-gb") : null}
                                                onChange={(date) => {
                                                    const newData = date ? date.format("YYYY-MM-DD") : null
                                                    handlePaymentChange(index, "dueDate", newData)
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        error: !!error,
                                                        inputProps: {
                                                            placeholder: "DD/MM/YYYY",
                                                        },
                                                    },
                                                }}
                                          />
                                      </FormControl>
                                      <TextField
                                            label="المبلغ"
                                            type="number"
                                            value={payment.amount}
                                            onChange={(e) => handlePaymentChange(index, "amount", e.target.value)}
                                            fullWidth
                                            sx={{mt: 2}}
                                      />
                                  </Grid>
                            ))}
                        </Grid>
                    </Box>
              )}

              {/* Submit Data Button */}
              <Button
                    variant="contained"
                    color="secondary"
                    onClick={onSubmit}
                    sx={{mt: 2}}
                    disabled={isSubmitDisabled}
              >
                  حفظ المنحة
              </Button>

              {/* Snackbar for Errors */}
              <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError(null)}
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
              >
                  <Alert onClose={() => setError(null)} severity="error" variant="filled">
                      {error}
                  </Alert>
              </Snackbar>
          </LocalizationProvider>
    );
}

export default AddAGrant;
