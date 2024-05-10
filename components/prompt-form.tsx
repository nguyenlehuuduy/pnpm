import { Button, buttonVariants } from '@/components/ui/button'
import {
  IconArrowElbow,
  IconCheck,
  IconPlus,
  IconRecord,
  IconUpload
} from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import findMimeType from '@/lib/findMimeType'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { UseChatHelpers } from 'ai/react'
import { useRouter } from 'next/navigation'
import OpenAI from 'openai'
import * as React from 'react'
import toast from 'react-hot-toast'
import { useReactMediaRecorder } from 'react-media-recorder-2'
import Textarea from 'react-textarea-autosize'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => void
  isLoading: boolean
}

const mimeType = findMimeType()

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [isRecording, setIsRecording] = React.useState(false)
  // const [recorder, setRecorder] = React.useState<MediaRecorder | undefined>(
  //   undefined
  // )
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      video: false,
      // blobPropertyBag: {
      //   type: mimeType
      // },
      onStart: () => {
        console.log('start recording')
        setIsRecording(true)
        toast('Đang thu âm!')
      },
      onStop: (blobUrl, blob) => {
        toast('Đã dừng thu âm!')
        console.log('end recording', blobUrl)
        setIsRecording(false)
        process(blob)
      }
    })
  // const [chunks, setChunks] = React.useState<Blob[]>([])

  // const checkAudioLevel = stream => {
  //   const audioContext = new AudioContext();
  //   const audioStreamSource = audioContext.createMediaStreamSource(stream);

  //   const analyser = audioContext.createAnalyser();
  //   analyser.maxDecibels = -10
  //   analyser.minDecibels = -45

  //   audioStreamSource.connect(analyser)

  //   const bufferLength = analyser.frequencyBinCount;
  //   const domainData = new Uint8Array(bufferLength);

  //   const detectSound = () => {

  //   }
  // }

  // const handleStream = stream => {
  //   console.log('handling stream', stream)
  //   const mediaRecorder = new MediaRecorder(stream)
  //   mediaRecorder.addEventListener('dataavailable', event => {
  //     console.log('data available', event)
  //   })
  //   mediaRecorder.addEventListener('stop', event => {
  //     console.log('stop', event)
  //   })
  //   mediaRecorder.start()

  //   checkAudioLevel(stream)
  // }

  // const startRecording = async () => {
  //   const stream = await navigator.mediaDevices.getUserMedia({
  //     audio: true
  //   })
  //   console.log('start recording')
  //   stream.addEventListener('addtrack', event => {
  //     console.log('addtrack', event)
  //   })
  //   const recorder = new MediaRecorder(stream, {
  //     mimeType: 'audio/webm'
  //   })

  //   toast('Đang thu âm!')
  //   setRecorder(recorder)
  //   setIsRecording(true)

  //   recorder.start()
  //   recorder.addEventListener('dataavailable', event => {
  //     const url = URL.createObjectURL(event.data)
  //     console.log(url)
  //     process(event.data)
  //   })
  // }

  // const stopRecording = () => {
  //   toast('Đã dừng thu âm!')
  //   console.log('stop recording')
  //   recorder?.stop()
  //   setIsRecording(false)
  // }

  const process = async (blob: Blob) => {
    const formData = new FormData()
    // const file = new File([blob], 'recording.mp3', {
    //   type: 'audio/mp3'
    // })
    // const mimeType = findMimeType()
    const mimeType = blob.type
    // toast(`blob type: ${blob.type}, mimeType: ${mimeType}`)
    console.log(`blob type: ${blob.type}, mimeType: ${mimeType}`)

    formData.append(
      'file',
      blob,
      `recording.${mimeType.split(';')[0].slice(6)}`
    )
    const response = await fetch('/api/audio', {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    console.log({ data })

    const { text } = data
    onSubmit(text)
  }

  const clickUploadFile = () => {
    inputFileRef.current?.click()
  }

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // process file uploaded
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) {
      return
    }
    console.log(file)

    // change type of file
    // const newFile = new File([file], 'recording.webm', {
    //   type: 'audio/webm'
    // })

    const formData = new FormData()
    formData.append('file', file)
    fetch('/api/audio', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const { text } = data
        onSubmit(text)
        console.log({ text })
      })

    // clear file
    target.value = ''
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex flex-row  items-center justify-center w-full  overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border lg:px-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              // disabled={isLoading}
              onClick={() => (isRecording ? stopRecording() : startRecording())}
              disabled={isLoading}
            >
              <IconRecord
                className={cn(
                  '',
                  isRecording ? 'fill-red-400' : 'fill-current '
                )}
              />
              <span className="sr-only">Record</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Record</TooltipContent>
        </Tooltip>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={e => {
                e.preventDefault()
                router.refresh()
                router.push('/')
              }}
              className={cn(
                buttonVariants({ size: 'sm', variant: 'outline' }),
                'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
              )}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip> */}
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          disabled={isRecording}
        />

        <div className="absolute right-0 top-4 sm:right-4 flex space-x-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || input === ''}
              >
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
