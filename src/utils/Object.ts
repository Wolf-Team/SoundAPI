interface ObjectConstructor {
	assign<A, B>(a: A, b: B): A & B;
	values<A>(a: A): A[keyof A][];
}

Object.assign = function <A, B>(a: A, b: B): A & B {
	return { ...a, ...b };
}
Object.values = function <A>(a: A): A[keyof A][] {
	const ret: A[keyof A][] = [];

	for (let key in a)
		ret.push(a[key]);

	return ret;
}
