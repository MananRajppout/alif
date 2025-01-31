"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export default function InterviewFeedbackModal({ open,onPass,onReject, onClose }: { open: boolean,onReject: () => void;onPass: () => void; onClose: () => void; }) {
    const [candidateStatus, setCandidateStatus] = useState("pass")

    const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCandidateStatus(event.target.value)
    }

    const handleSubmit = () => {
        if(candidateStatus == 'pass'){
            onPass()
        }else{
            onReject();
        }
        onClose();
    }

    return (
        <div className={`fixed  h-[100vh] w-[100vw] top-0 left-0 right-0 bottom-0 overflow-auto ${!open && 'hidden'}`}>
            <div className="bg-gray-100 p-4 mt-20">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader className="bg-blue-500 text-white text-center">
                        <CardTitle className="text-2xl font-bold">Interview Feedback Form</CardTitle>
                        <p className="text-sm mt-2">
                            Please review the candidate's strengths and weaknesses and provide a brief comment.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        {/* Candidate Information */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h2 className="font-semibold text-lg">Candidate Information</h2>
                                <div>
                                    <p className="text-sm text-gray-500">Candidate Name</p>
                                    <p>John Doe</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Position Applied For</p>
                                    <p>Software Engineer</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Interview Date</p>
                                    <p>January 18, 2025</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Interviewer</p>
                                    <p>Jane Smith</p>
                                </div>
                            </div>
                        </div>

                        {/* Strengths and Weaknesses */}
                        <div>
                            <h2 className="font-semibold text-lg mb-4">Strengths and Weaknesses</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-blue-500">
                                        <CheckCircle className="h-5 w-5" />
                                        <h3 className="font-medium">Strengths</h3>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm pl-1">
                                        <li>Strong technical expertise</li>
                                        <li>Good problem-solving skills</li>
                                        <li>Enthusiastic and motivated</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-amber-500">
                                        <AlertTriangle className="h-5 w-5" />
                                        <h3 className="font-medium">Weaknesses</h3>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-sm pl-1">
                                        <li>Needs improvement in communication</li>
                                        <li>Struggled with time management</li>
                                        <li>Lacks experience in JavaScript</li>
                                    </ul>
                                </div>
                            </div>
                        </div>



                        <div className="space-y-4">
                            <h2 className="font-semibold text-lg">Candidate Status</h2>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="reject"
                                        name="candidateStatus"
                                        value="reject"
                                        checked={candidateStatus === "reject"}
                                        onChange={handleStatusChange}
                                        className="form-radio text-blue-500"
                                    />
                                    <label htmlFor="reject">Reject</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        id="pass"
                                        name="candidateStatus"
                                        value="pass"
                                        checked={candidateStatus === "pass"}
                                        onChange={handleStatusChange}
                                        className="form-radio text-blue-500"
                                    />
                                    <label htmlFor="pass">Pass</label>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 justify-end pt-4" onClick={handleSubmit}>
                            <Button variant="outline">Save Draft</Button>
                            <Button>Submit Feedback</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

