'use client'

import { interviewer } from "@/constants";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

interface SavedMessage {
    role: 'user' | 'system' | "assistant",
    content: string
}




const Agent = ({ userName, userId, type, interviewId, questions }: AgentProps) => {

    const router = useRouter();

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)

    const [messages, setMessages] = useState<SavedMessage[]>([])
    const lastMessage = messages[messages.length - 1]

    // handle call operation 
    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage = (message: Message) => {
            if (message.type === 'transcript' && message.transcriptType === "final") {
                const newMessage = { role: message.role, content: message.transcript }
                setMessages((prev) => [...prev, newMessage])
            }
        }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log("error", error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('message', onMessage);
        vapi.on('speech-start', onSpeechStart);
        vapi.on('speech-end', onSpeechEnd);
        vapi.on('error', onError)

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('message', onMessage);
            vapi.off('speech-start', onSpeechStart);
            vapi.off('speech-end', onSpeechEnd);
            vapi.off('error', onError)
        }
    }, [])

    // handle a function to generate feedBack
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
        const { succes, id } = {
            succes: true,
            id: 'feedback-id'
        }
        if (succes && id) {
            router.push(`/interview/${interviewId}/feedback`)
        } else {
            console.log('Error saving feedback');

            router.push('/')
        }
    }
    // handle finishing calls 
    useEffect(() => {
        if (callStatus === CallStatus.FINISHED) {

        }
    }, [messages, userId, userName, type])

    // handle call 
    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING)
        if (type === 'generate') {
            await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
                variableValues: {
                    username: userName,
                    userid: userId
                }
            })
        } else {
            let formattedQuestions = '';
            if (questions) {
                formattedQuestions = questions.map((question) => `-${question}`).join('\n')
            }
            await vapi.start(interviewer, {
                variableValues: {
                    questions: formattedQuestions
                }
            })
        }
    }

    // handle disconnect the call 
    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    // get last message content
    const latestMessage = lastMessage?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || CallStatus.FINISHED
    return (
        <>
            <div className="call-view">
                <div className="card-interviewer">
                    <div className="avatar">
                        <Image src='/ai-avatar.png' alt="vapi" width={65} height={54} className="object-cover" />
                        {isSpeaking && <span className="animate-speak" />}
                    </div>
                    <h3>AI Interviewer</h3>
                </div>
                <div className="card-border">
                    <div className="card-content">
                        <Image src='/user-avatar.png' alt="user avatar" width={540} height={540} className="rounded-full object-cover size-[120px]" />
                        <h3>{userName}</h3>
                    </div>
                </div>
            </div>
            {messages.length > 0 && (
                <div className="transcript-border">
                    <div className="transcript">
                        <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0', 'animate-fadeIn opacity-100')}>
                            {latestMessage}
                        </p>
                    </div>
                </div>
            )}
            <div className="w-full flex justify-center">
                {callStatus !== "ACTIVE" ? (
                    <button className="btn-call relative" onClick={handleCall}>
                        <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')} />

                        <span>
                            {isCallInactiveOrFinished ? 'call' : '...'}
                        </span>

                    </button>
                ) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End
                    </button>
                )}
            </div>
        </>
    )
}

export default Agent