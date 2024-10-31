"use client";
import React, {useState} from "react";
import {
    Box,
    Typography,

    Paper,
    List,
    ListItemText,
    ListItemButton,
    Collapse,
    Button,
} from "@mui/material";
import Link from "next/link";
import {MdOutlineExpandLess, MdOutlineExpandMore} from "react-icons/md";

// Fake FAQ Data
const faqData = [
    {
        question: "ما هو الموعد النهائي لتقديم الطلبات؟",
        answer: "يجب تقديم الطلبات قبل نهاية شهر ديسمبر من كل عام."
    },
    {
        question: "ما هي الأوراق المطلوبة للتقديم؟",
        answer: "تشمل الأوراق المطلوبة شهادة الميلاد، الهوية الشخصية، وأي شهادات دراسية أخرى ذات صلة."
    },
    {
        question: "هل يمكنني تعديل طلب التقديم بعد إرساله؟",
        answer: "نعم، يمكنك تعديل طلب التقديم حتى الموعد النهائي للتقديم."
    },
    {
        question: "ما هي مدة دراسة الطلب؟",
        answer: "يتم دراسة الطلب خلال أسبوعين إلى أربعة أسابيع من تاريخ التقديم."
    }
];

export default function FAQPage({id, route = "drafts"}) {
    const [openItems, setOpenItems] = useState({});

    const handleToggle = (index) => {
        setOpenItems((prevOpenItems) => ({
            ...prevOpenItems,
            [index]: !prevOpenItems[index]
        }));
    };


    return (
          <Box sx={{p: 4, maxWidth: "800px", margin: "auto"}}>
              <Typography variant="h4" gutterBottom textAlign="center">
                  الأسئلة الشائعة
              </Typography>

              {/* Checkbox with link */}


              {/* FAQ List */}
              <List>
                  {faqData.map((item, index) => (
                        <Paper elevation={3} sx={{mb: 2}} key={index}>
                            <ListItemButton onClick={() => handleToggle(index)}>
                                <ListItemText primary={item.question}/>
                                {openItems[index] ? <MdOutlineExpandLess/>
                                      : <MdOutlineExpandMore/>}
                            </ListItemButton>
                            <Collapse in={openItems[index]} timeout="auto" unmountOnExit>
                                <Box sx={{pl: 4, pr: 4, pb: 2}}>
                                    <Typography variant="body1">
                                        {item.answer}
                                    </Typography>
                                </Box>
                            </Collapse>
                        </Paper>
                  ))}
              </List>

              {/* Button to submit the application */}
              <Box sx={{textAlign: "center", mt: 4}}>
                  <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        href={`/dashboard/applications/${route}/${id}/save`}
                  >
                      الانتقال الي صفحة حفظ الطلب وتقديمة للادارة
                  </Button>
              </Box>
          </Box>
    );
}
