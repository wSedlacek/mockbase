import * as firebase from "firebase";
import { MockFirestore, Query } from "./";
import { DocumentReference } from "./document-reference";
import { DataContainer } from "./data-container";
import { EventEmitter } from "events";

export const COLLECTION_CHANGE_EVENT = "change";

export class CollectionReference
  implements firebase.firestore.CollectionReference, DataContainer<DocumentReference> {
  public readonly children: Map<string, DocumentReference>;

  public readonly emitter = new EventEmitter();

  get path(): string {
    const parent = this.parent ? this.parent.path : "";
    return parent + "/" + this.id;
  }

  constructor(
    public readonly firestore: MockFirestore,
    public readonly id: string,
    public readonly parent: DocumentReference | null = null
  ) {
    const dataContainer: DataContainer<CollectionReference> = parent || firestore;

    let ref = dataContainer.children.get(id);

    if (!ref) {
      this.children = new Map();
      ref = this;
      dataContainer.children.set(id, this);
    }

    this.children = ref.children;
  }

  doc(documentPath?: string | undefined): DocumentReference {
    return new DocumentReference(this.firestore, documentPath || this.firestore.nextId(), this);
  }

  add(data: firebase.firestore.DocumentData): Promise<DocumentReference> {
    const doc = this.doc();
    return doc.set(data).then(() => doc);
  }

  where(
    fieldPath: string | firebase.firestore.FieldPath,
    opStr: firebase.firestore.WhereFilterOp,
    value: any
  ): firebase.firestore.Query {
    return new Query(this).where(fieldPath, opStr, value);
  }

  orderBy(
    fieldPath: string | firebase.firestore.FieldPath,
    directionStr?: "desc" | "asc" | undefined
  ): firebase.firestore.Query {
    return new Query(this).orderBy(fieldPath, directionStr);
  }

  limit(limit: number): firebase.firestore.Query {
    return new Query(this).limit(limit);
  }

  startAt(snapshot: firebase.firestore.DocumentSnapshot): firebase.firestore.Query;
  startAt(...fieldValues: any[]): firebase.firestore.Query;
  startAt(snapshot?: any, ...rest: any[]): firebase.firestore.Query {
    return new Query(this).startAt(snapshot, ...rest);
  }

  startAfter(snapshot: firebase.firestore.DocumentSnapshot): firebase.firestore.Query;
  startAfter(...fieldValues: any[]): firebase.firestore.Query;
  startAfter(snapshot?: any, ...rest: any[]): firebase.firestore.Query {
    return new Query(this).startAfter(snapshot, ...rest);
  }

  endBefore(snapshot: firebase.firestore.DocumentSnapshot): firebase.firestore.Query;
  endBefore(...fieldValues: any[]): firebase.firestore.Query;
  endBefore(snapshot?: any, ...rest: any[]): firebase.firestore.Query {
    return new Query(this).endBefore(snapshot, ...rest);
  }

  endAt(snapshot: firebase.firestore.DocumentSnapshot): firebase.firestore.Query;
  endAt(...fieldValues: any[]): firebase.firestore.Query;
  endAt(snapshot?: any, ...rest: any[]): firebase.firestore.Query {
    return new Query(this).endAt(snapshot, ...rest);
  }

  isEqual(other: firebase.firestore.Query): boolean {
    throw new Error("Method not implemented.");
  }

  get(): Promise<firebase.firestore.QuerySnapshot> {
    return new Query(this).get();
  }

  onSnapshot(observer: {
    next?: ((snapshot: firebase.firestore.QuerySnapshot) => void) | undefined;
    error?: ((error: Error) => void) | undefined;
    complete?: (() => void) | undefined;
  }): () => void;

  onSnapshot(
    options: firebase.firestore.QueryListenOptions,
    observer: {
      next?: ((snapshot: firebase.firestore.QuerySnapshot) => void) | undefined;
      error?: ((error: Error) => void) | undefined;
      complete?: (() => void) | undefined;
    }
  ): () => void;

  onSnapshot(
    onNext: (snapshot: firebase.firestore.QuerySnapshot) => void,
    onError?: ((error: Error) => void) | undefined,
    onCompletion?: (() => void) | undefined
  ): () => void;

  onSnapshot(
    options: firebase.firestore.QueryListenOptions,
    onNext: (snapshot: firebase.firestore.QuerySnapshot) => void,
    onError?: ((error: Error) => void) | undefined,
    onCompletion?: (() => void) | undefined
  ): () => void;

  onSnapshot(options: any, onNext?: any, onError?: any, onCompletion?: any): () => void {
    return new Query(this).onSnapshot(options, onNext, onError, onCompletion);
  }
}
