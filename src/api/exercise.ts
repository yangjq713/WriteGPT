export interface QuestionData {
    id: number;
    title: string;
    question: string;
    shortMessage: string;
    createDate: Date;
}

export interface AnswerData{
    qid: number;
    answer: string;
}

export interface TypeOptions{
    id: number;
    label: string;
    key: string;
    children: TypeOptions[];
}