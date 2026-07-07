import React, { useContext, useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AppContext } from "../../context/AppContextProvider";
import axios from 'axios'
import { toast } from 'react-toastify'

const Invoices = () => {

    const { appointmentId } = useParams()
    const { backendUrl, token } = useContext(AppContext)

    const [appointment, setAppointment] = useState(null)
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)

    const invoiceRef = useRef()
    const navigate = useNavigate()

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    const formatDate = (slotDate) => {
        if (!slotDate || !slotDate.includes("_")) return ""
        const d = slotDate.split("_")
        return `${d[0]} ${months[Number(d[1]) - 1]} ${d[2]}`
    }

    const formatTimestamp = (ts) => {
        if (!ts) return ""
        return new Date(ts).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const receiptNo = appointment
        ? `RCP-${appointment._id?.slice(-8).toUpperCase()}`
        : ""

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const { data } = await axios.get(
                    `${backendUrl}/api/user/appointments`,
                    { headers: { token } }
                )
                if (data.success) {
                    const appt = data.appointments.find((a) => a._id === appointmentId)
                    if (appt) {
                        setAppointment(appt)
                    } else {
                        toast.error("Appointment not found")
                    }
                } else {
                    toast.error("Failed to load invoice")
                }
            } catch (error) {
                console.log(error)
                toast.error("Failed to load invoice")
            } finally {
                setLoading(false)
            }
        }
        if (token) fetchAppointment()
    }, [appointmentId, token, backendUrl])

    const handleDownloadPDF = async () => {
        setDownloading(true)
        try {
            if (!window.html2pdf && !document.getElementById("html2pdf-script")) {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script')
                    script.id = "html2pdf-script"
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
                    script.onload = resolve
                    script.onerror = reject
                    document.head.appendChild(script)
                })
            }
            const element = invoiceRef.current
            const opt = {
                margin: [8, 8, 8, 8],
                filename: `Prescripto-Invoice-${receiptNo}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            }
            await window.html2pdf().set(opt).from(element).save()
            toast.success("Invoice downloaded successfully!")
        } catch (error) {
            console.log(error)
            toast.error("Download failed. Try Print instead.")
        } finally {
            setDownloading(false)
        }
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
                <div style={{
                    width: '2.5rem', height: '2.5rem',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #2563eb',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!appointment) {
        return (
            <div style={{ textAlign: 'center', padding: '5rem 0', color: '#9ca3af', fontSize: '1rem' }}>
                Invoice not found.
            </div>
        )
    }

    const consultationFee = appointment.amount
    const gst = Math.round(consultationFee * 0.18 * 100) / 100
    const baseAmount = Math.round((consultationFee / 1.18) * 100) / 100

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f5f3ff 100%)',
            padding: '2.5rem 1rem',
            fontFamily: "'Segoe UI', system-ui, sans-serif"
        }}>
            {/* ── Action Buttons ── */}
            <div style={{
                maxWidth: '760px', margin: '0 auto 1.25rem auto',
                display: 'flex', gap: '0.75rem', flexWrap: 'wrap',
                alignItems: 'center'
            }} className="print-hidden">
                <button
                    onClick={() => navigate('/my-appointments')}
                    style={{
                        padding: '0.5rem 1.1rem', fontSize: '0.85rem',
                        border: '1px solid #d1d5db', borderRadius: '8px',
                        background: 'white', color: '#374151',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
                    }}
                >
                    ← Back
                </button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.6rem' }}>
                    <button
                        onClick={() => window.print()}
                        style={{
                            padding: '0.5rem 1.25rem', fontSize: '0.85rem',
                            border: '1px solid #d1d5db', borderRadius: '8px',
                            background: 'white', color: '#374151',
                            cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
                        }}
                    >
                        🖨️ Print
                    </button>
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        style={{
                            padding: '0.5rem 1.4rem', fontSize: '0.85rem',
                            background: downloading ? '#93c5fd' : 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                            color: 'white', border: 'none', borderRadius: '8px',
                            cursor: downloading ? 'not-allowed' : 'pointer',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
                            fontWeight: '600'
                        }}
                    >
                        {downloading ? "⏳ Generating..." : "⬇️ Download PDF"}
                    </button>
                </div>
            </div>

            {/* ── Invoice Card ── */}
            <div
                ref={invoiceRef}
                style={{
                    maxWidth: '760px', margin: '0 auto',
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(37,99,235,0.12), 0 4px 16px rgba(0,0,0,0.08)'
                }}
            >
                {/* ── Header ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)',
                    padding: '2rem 2.5rem',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* decorative circles */}
                    <div style={{
                        position: 'absolute', top: '-40px', right: '-40px',
                        width: '180px', height: '180px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)'
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '-20px', left: '40%',
                        width: '100px', height: '100px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.04)'
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.1rem'
                                }}>
                                    🏥
                                </div>
                                <h1 style={{
                                    fontSize: '1.7rem', fontWeight: '800',
                                    color: 'white', letterSpacing: '-0.5px', margin: 0
                                }}>
                                    Prescripto
                                </h1>
                            </div>
                            <p style={{ color: 'rgba(186,210,255,0.9)', fontSize: '0.8rem', margin: '0 0 0.2rem 0' }}>
                                Healthcare Appointment Platform
                            </p>
                            <p style={{ color: 'rgba(186,210,255,0.7)', fontSize: '0.75rem', margin: 0 }}>
                                support@prescripto.com
                            </p>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.25)',
                            borderRadius: '14px',
                            padding: '0.9rem 1.4rem',
                            textAlign: 'right'
                        }}>
                            <p style={{ color: 'rgba(186,210,255,0.8)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 0.3rem 0' }}>
                                Receipt No.
                            </p>
                            <p style={{ color: 'white', fontSize: '1.05rem', fontWeight: '800', letterSpacing: '1px', margin: '0 0 0.4rem 0' }}>
                                {receiptNo}
                            </p>
                            <p style={{ color: 'rgba(186,210,255,0.7)', fontSize: '0.7rem', margin: 0 }}>
                                TAX INVOICE
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Payment Confirmed Banner ── */}
                <div style={{
                    background: 'linear-gradient(90deg, #f0fdf4, #dcfce7)',
                    borderBottom: '1px solid #bbf7d0',
                    padding: '0.75rem 2.5rem',
                    display: 'flex', alignItems: 'center', gap: '0.6rem'
                }}>
                    <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: '#16a34a', display: 'inline-block',
                        boxShadow: '0 0 0 3px rgba(22,163,74,0.2)'
                    }} />
                    <span style={{ color: '#15803d', fontSize: '0.85rem', fontWeight: '700' }}>
                        ✅ Payment Confirmed
                    </span>
                    <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: '0.75rem' }}>
                        {formatTimestamp(appointment.date)}
                    </span>
                </div>

                {/* ── Body ── */}
                <div style={{ padding: '2rem 2.5rem' }}>

                    {/* Bill To + Appointment Info */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem', marginBottom: '1.75rem'
                    }}>
                        {/* Bill To */}
                        <div style={{
                            background: '#f8faff',
                            border: '1px solid #e0e7ff',
                            borderRadius: '14px',
                            padding: '1.25rem 1.4rem'
                        }}>
                            <p style={{
                                fontSize: '0.65rem', color: '#6366f1',
                                textTransform: 'uppercase', letterSpacing: '2px',
                                fontWeight: '700', margin: '0 0 0.6rem 0'
                            }}>
                                Bill To
                            </p>
                            <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem', margin: '0 0 0.3rem 0' }}>
                                {appointment.userData?.name}
                            </p>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.2rem 0' }}>
                                {appointment.userData?.email}
                            </p>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
                                {appointment.userData?.phone || ""}
                            </p>
                        </div>

                        {/* Appointment */}
                        <div style={{
                            background: '#f8faff',
                            border: '1px solid #e0e7ff',
                            borderRadius: '14px',
                            padding: '1.25rem 1.4rem'
                        }}>
                            <p style={{
                                fontSize: '0.65rem', color: '#6366f1',
                                textTransform: 'uppercase', letterSpacing: '2px',
                                fontWeight: '700', margin: '0 0 0.6rem 0'
                            }}>
                                Appointment Details
                            </p>
                            <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '1rem', margin: '0 0 0.3rem 0' }}>
                                📅 {formatDate(appointment.slotDate)}
                            </p>
                            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0 0 0.2rem 0' }}>
                                🕐 {appointment.slotTime}
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0, fontFamily: 'monospace' }}>
                                ID: {appointment._id?.slice(-10).toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Doctor Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                        border: '1px solid #bfdbfe',
                        borderRadius: '16px',
                        padding: '1.25rem 1.5rem',
                        display: 'flex', alignItems: 'center', gap: '1.1rem',
                        marginBottom: '1.75rem'
                    }}>
                        <img
                            src={appointment.docData?.image}
                            alt={appointment.docData?.name}
                            crossOrigin="anonymous"
                            style={{
                                width: '64px', height: '64px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '3px solid white',
                                boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <p style={{
                                fontSize: '0.65rem', color: '#3b82f6',
                                textTransform: 'uppercase', letterSpacing: '2px',
                                fontWeight: '700', margin: '0 0 0.3rem 0'
                            }}>
                                Consulting Doctor
                            </p>
                            <p style={{ fontWeight: '800', color: '#1e293b', fontSize: '1.05rem', margin: '0 0 0.2rem 0' }}>
                                {appointment.docData?.name}
                            </p>
                            <p style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: '600', margin: '0 0 0.15rem 0' }}>
                                {appointment.docData?.speciality}
                            </p>
                            <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                                {appointment.docData?.degree} · {appointment.docData?.experience}
                            </p>
                        </div>
                        <div style={{
                            background: 'white', borderRadius: '12px',
                            padding: '0.6rem 1rem', textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(37,99,235,0.12)'
                        }}>
                            <p style={{ color: '#6b7280', fontSize: '0.65rem', margin: '0 0 0.2rem 0' }}>Fee</p>
                            <p style={{ color: '#1d4ed8', fontWeight: '800', fontSize: '1.1rem', margin: 0 }}>
                                ₹{baseAmount}
                            </p>
                        </div>
                    </div>

                    {/* Invoice Table */}
                    <div style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px', overflow: 'hidden',
                        marginBottom: '1.5rem'
                    }}>
                        {/* Table Header */}
                        <div style={{
                            background: '#f8faff',
                            borderBottom: '1px solid #e2e8f0',
                            display: 'grid', gridTemplateColumns: '1fr auto',
                            padding: '0.75rem 1.4rem'
                        }}>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>
                                Description
                            </span>
                            <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>
                                Amount
                            </span>
                        </div>

                        {/* Consultation Row */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr auto',
                            padding: '1rem 1.4rem',
                            borderBottom: '1px solid #f1f5f9',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>
                                    Consultation Fee
                                </p>
                                <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                                    {appointment.docData?.speciality} · {formatDate(appointment.slotDate)} at {appointment.slotTime}
                                </p>
                            </div>
                            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.9rem' }}>
                                ₹{baseAmount}
                            </span>
                        </div>

                        {/* GST Row */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr auto',
                            padding: '0.75rem 1.4rem',
                            borderBottom: '1px solid #f1f5f9',
                            background: '#fafbff',
                            alignItems: 'center'
                        }}>
                            <div>
                                <p style={{ color: '#64748b', fontSize: '0.83rem', margin: '0 0 0.15rem 0', fontWeight: '500' }}>
                                    GST (18%)
                                </p>
                                <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: 0 }}>
                                    GSTIN: As applicable
                                </p>
                            </div>
                            <span style={{ color: '#64748b', fontSize: '0.83rem' }}>
                                ₹{gst}
                            </span>
                        </div>

                        {/* Total Row */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr auto',
                            padding: '1.1rem 1.4rem',
                            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontWeight: '800', color: 'white', fontSize: '1rem' }}>
                                Total Paid
                            </span>
                            <span style={{ fontWeight: '900', color: 'white', fontSize: '1.5rem', letterSpacing: '-0.5px' }}>
                                ₹{consultationFee}
                            </span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div style={{
                        background: '#f8faff',
                        border: '1px solid #e0e7ff',
                        borderRadius: '14px',
                        padding: '1rem 1.4rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        marginBottom: '1.75rem'
                    }}>
                        <div>
                            <p style={{ color: '#94a3b8', fontSize: '0.72rem', margin: '0 0 0.3rem 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                Payment Method
                            </p>
                            <p style={{ color: '#1e293b', fontWeight: '700', fontSize: '0.87rem', margin: 0 }}>
                                💳 Razorpay · Online Payment
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{
                                background: 'linear-gradient(135deg, #16a34a, #22c55e)',
                                color: 'white', fontSize: '0.72rem',
                                fontWeight: '800', padding: '0.35rem 0.9rem',
                                borderRadius: '999px', letterSpacing: '1px'
                            }}>
                                PAID ✓
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{
                        borderTop: '2px dashed #e2e8f0',
                        margin: '0 0 1.25rem 0'
                    }} />

                    {/* Footer */}
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.73rem', margin: '0 0 0.3rem 0' }}>
                            This is a computer-generated receipt and does not require a physical signature.
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.73rem', margin: 0 }}>
                            For queries, contact <span style={{ color: '#3b82f6', fontWeight: '600' }}>support@prescripto.com</span>
                        </p>
                    </div>
                </div>

                {/* ── Bottom accent bar ── */}
                <div style={{
                    height: '6px',
                    background: 'linear-gradient(90deg, #1d4ed8, #3b82f6, #6366f1, #8b5cf6)'
                }} />
            </div>

            <style>{`
                @media print {
                    .print-hidden { display: none !important; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    )
}

export default Invoices